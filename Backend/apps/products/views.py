from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, ProductImage, ProductRequest
from .serializers import ProductSerializer, ProductImageSerializer, ProductRequestSerializer
from core.utils import get_mongo_db


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]

        try:
            # Try parsing as integer for legacy entries created before ObjectId migration
            return queryset.get(**{self.lookup_field: int(lookup_value)})
        except ValueError:
            pass
        except Exception:
            pass

        try:
            from bson import ObjectId
            # Try direct ObjectId lookup if valid
            if ObjectId.is_valid(lookup_value):
                try:
                    return queryset.get(id=ObjectId(lookup_value))
                except:
                    pass
            
            # Fallback to standard lookup
            return queryset.get(**{self.lookup_field: lookup_value})
        except Exception as e:
            from django.http import Http404
            raise Http404(f"Product not found: {str(e)}")

    def list(self, request, *args, **kwargs):
        """
        Override list() to use raw PyMongo, bypassing Djongo's broken
        .order_by() + pagination that causes 500 errors.
        """
        try:
            db = get_mongo_db()
            collection = db['products_product']

            # Build filter from query params
            query = {}
            
            # Only show vendor's products or admin products (vendor=None) based on scope
            vendor_id = request.query_params.get('vendor', '')
            if vendor_id:
                if vendor_id == 'none' or vendor_id == 'null':
                    query['vendor_id'] = None
                else:
                    query['vendor_id'] = vendor_id
            
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}},
                    {'tag': {'$regex': search, '$options': 'i'}},
                ]

            is_active = request.query_params.get('is_active', '')
            if is_active.lower() == 'true':
                query['is_active'] = True
            elif is_active.lower() == 'false':
                query['is_active'] = False

            # Pagination
            try:
                page = int(request.query_params.get('page', 1))
                page_size = int(request.query_params.get('page_size', 20))
            except (ValueError, TypeError):
                page = 1
                page_size = 20

            skip = (page - 1) * page_size
            total = collection.count_documents(query)
            docs = list(collection.find(query).sort('_id', -1).skip(skip).limit(page_size))

            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)

            return Response({
                'count': total,
                'page': page,
                'page_size': page_size,
                'total_pages': (total + page_size - 1) // page_size,
                'results': results,
            })
        except Exception as e:
            # Fallback: try plain ORM without order_by
            try:
                qs = Product.objects.all()
                serializer = self.get_serializer(qs, many=True)
                return Response({'count': qs.count(), 'results': serializer.data})
            except Exception as e2:
                return Response({'count': 0, 'results': [], 'error': str(e2)})

    @action(detail=False, methods=['get'], url_path='master-catalog')
    def master_catalog(self, request):
        """Returns products created by Admin (vendor=None) for Wholesale."""
        try:
            db = get_mongo_db()
            collection = db['products_product']
            
            # Use raw Mongo to avoid Djongo ORM 'IS NULL' decoding bugs
            query = {'vendor_id': None, 'is_active': True}
            
            search = request.query_params.get('search', '').strip()
            if search:
                query['$or'] = [
                    {'title': {'$regex': search, '$options': 'i'}},
                    {'sku': {'$regex': search, '$options': 'i'}},
                ]

            docs = list(collection.find(query).sort('_id', -1))
            
            from core.utils import sanitize_mongo_doc
            results = sanitize_mongo_doc(docs)
            
            # Manually add category_name if missing
            cat_ids = list(set([doc.get('category_id') for doc in results if doc.get('category_id')]))
            if cat_ids:
                from bson import ObjectId
                cat_map = {}
                cat_docs = list(db['categories_category'].find({'_id': {'$in': [ObjectId(str(cid)) for cid in cat_ids]}}))
                for c in cat_docs:
                    cat_map[str(c['_id'])] = c.get('name')
                
                for doc in results:
                    cid = doc.get('category_id')
                    if cid and str(cid) in cat_map:
                        doc['category_name'] = cat_map[str(cid)]

            return Response({'results': results})
        except Exception as e:
            return Response({'error': str(e)}, status=400)

    @action(detail=False, methods=['post'], url_path='bulk-import')
    def bulk_import(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=400)

        import_mode = request.data.get('import_mode', 'add_new')

        import io
        import csv
        from django.utils.text import slugify
        from bson import ObjectId
        from apps.categories.models import Category
        
        name = file_obj.name.lower()
        if name.endswith('.csv'):
            try:
                csv_data = file_obj.read().decode('utf-8-sig')
                csv_file = io.StringIO(csv_data)
                reader = csv.DictReader(csv_file)
            except Exception as e:
                return Response({'errors': [f'Failed to parse CSV: {str(e)}']}, status=400)
        elif name.endswith(('.xlsx', '.xls')):
            try:
                import openpyxl
                wb = openpyxl.load_workbook(file_obj, data_only=True)
                ws = wb.active
                rows = list(ws.values)
                if len(rows) < 1:
                    return Response({'errors': ['Excel file is empty']}, status=400)
                
                # Find the first non-empty row to get headers
                header_row_idx = 0
                while header_row_idx < len(rows) and not any(rows[header_row_idx]):
                    header_row_idx += 1
                
                if header_row_idx >= len(rows):
                    return Response({'errors': ['Excel file contains only empty rows']}, status=400)
                
                headers = [str(h).strip().lower() for h in rows[header_row_idx] if h is not None]
                reader = []
                for row in rows[header_row_idx + 1:]:
                    if any(row):
                        row_dict = {}
                        for i, h in enumerate(headers):
                            if i < len(row) and h:
                                row_dict[h] = row[i]
                        reader.append(row_dict)
            except ImportError:
                return Response({'errors': ["Excel parsing requires 'openpyxl' library. Please install it or upload a CSV file instead."]}, status=400)
            except Exception as e:
                return Response({'errors': [f'Failed to parse Excel file: {str(e)}']}, status=400)
        else:
            return Response({'errors': ['Unsupported file format. Please upload a .csv or .xlsx file.']}, status=400)

        created_count = 0
        updated_count = 0
        skipped_count = 0
        failed_count = 0
        errors = []

        for row_idx, row in enumerate(reader, start=header_row_idx + 2 if name.endswith(('.xlsx', '.xls')) else 2):
            try:
                normalized_row = {str(k).strip().lower(): v for k, v in row.items() if k is not None}
                
                title = normalized_row.get('name') or normalized_row.get('title')
                if not title or str(title).strip().lower() == 'none':
                    errors.append(f"Row {row_idx}: 'name' or 'title' is required.")
                    failed_count += 1
                    continue
                
                title = str(title).strip()
                sku = normalized_row.get('sku')
                if sku is not None and str(sku).strip().lower() != 'none':
                    sku = str(sku).strip()
                else:
                    sku = None
                    
                slug = normalized_row.get('slug')
                if slug is not None and str(slug).strip().lower() != 'none':
                    slug = str(slug).strip()
                else:
                    slug = slugify(title)

                existing_product = None
                if sku:
                    existing_product = Product.objects.filter(sku=sku).first()
                if not existing_product and slug:
                    existing_product = Product.objects.filter(slug=slug).first()

                if existing_product:
                    if import_mode == 'add_new':
                        skipped_count += 1
                        continue
                else:
                    if import_mode == 'update_only':
                        skipped_count += 1
                        continue

                price_str = normalized_row.get('price')
                if price_str is not None and str(price_str).strip() != '' and str(price_str).strip().lower() != 'none':
                    try:
                        price_val = float(str(price_str).replace('$', '').strip())
                    except ValueError:
                        price_val = 0.0
                else:
                    price_val = 0.0

                sale_price_str = normalized_row.get('sale_price') or normalized_row.get('discount_price')
                discount_price_val = None
                discount_type = 'NONE'
                discount_value = 0.0
                if sale_price_str is not None and str(sale_price_str).strip() != '' and str(sale_price_str).strip().lower() != 'none':
                    try:
                        discount_price_val = float(str(sale_price_str).replace('$', '').strip())
                        if discount_price_val < price_val:
                            discount_type = 'FIXED'
                            discount_value = price_val - discount_price_val
                        else:
                            discount_price_val = None
                    except ValueError:
                        pass

                stock_str = normalized_row.get('stock_quantity') or normalized_row.get('stock')
                if stock_str is not None and str(stock_str).strip() != '' and str(stock_str).strip().lower() != 'none':
                    try:
                        stock_val = int(float(str(stock_str).strip()))
                    except ValueError:
                        stock_val = 0
                else:
                    stock_val = 0

                category_name = normalized_row.get('category')
                category_obj = None
                if category_name is not None and str(category_name).strip() != '' and str(category_name).strip().lower() != 'none':
                    category_name = str(category_name).strip()
                    category_obj = Category.objects.filter(name__iexact=category_name).first()
                    if not category_obj and category_name:
                        category_obj = Category.objects.create(
                            name=category_name,
                            slug=slugify(category_name)
                        )

                color_str = normalized_row.get('color') or normalized_row.get('colors')
                colors_data = None
                if color_str is not None and str(color_str).strip() != '' and str(color_str).strip().lower() != 'none':
                    color_list = [c.strip() for c in str(color_str).split('|') if c.strip()]
                    import json
                    colors_data = json.dumps(color_list)

                size_str = normalized_row.get('size') or normalized_row.get('sizes')
                sizes_data = None
                if size_str is not None and str(size_str).strip() != '' and str(size_str).strip().lower() != 'none':
                    import json
                    size_list = [s.strip() for s in str(size_str).split('|') if s.strip()]
                    sizes_data = json.dumps(size_list)

                length = normalized_row.get('length')
                width = normalized_row.get('width')
                height = normalized_row.get('height')
                dimensions = normalized_row.get('dimensions')
                if not dimensions and (length or width or height):
                    l = str(length).strip() if length is not None and str(length).strip().lower() != 'none' else '0'
                    w = str(width).strip() if width is not None and str(width).strip().lower() != 'none' else '0'
                    h = str(height).strip() if height is not None and str(height).strip().lower() != 'none' else '0'
                    dimensions = f"{l}x{w}x{h}"
                elif dimensions is not None and str(dimensions).strip().lower() == 'none':
                    dimensions = None

                is_active = True
                active_str = str(normalized_row.get('is_active', 'true')).lower()
                if active_str in ('false', '0', 'no'):
                    is_active = False

                highlight_featured = False
                featured_str = str(normalized_row.get('featured', 'false')).lower()
                if featured_str in ('true', '1', 'yes'):
                    highlight_featured = True

                tags = normalized_row.get('tags') or normalized_row.get('tag')
                if tags is not None and str(tags).strip().lower() != 'none':
                    tags = str(tags).strip()
                else:
                    tags = None

                brand = normalized_row.get('brand')
                if brand is not None and str(brand).strip().lower() != 'none':
                    brand = str(brand).strip()
                else:
                    brand = None

                description = normalized_row.get('description') or normalized_row.get('short_description', '')
                if description is not None and str(description).strip().lower() != 'none':
                    description = str(description).strip()
                else:
                    description = ''

                material = normalized_row.get('material')
                if material is not None and str(material).strip().lower() != 'none':
                    material = str(material).strip()
                else:
                    material = None

                weight = normalized_row.get('weight')
                if weight is not None and str(weight).strip().lower() != 'none':
                    weight = str(weight).strip()
                else:
                    weight = None

                if existing_product:
                    from bson.decimal128 import Decimal128
                    for field in ['price', 'discount_price', 'discount_value']:
                        val = getattr(existing_product, field, None)
                        if isinstance(val, Decimal128):
                            setattr(existing_product, field, val.to_decimal())

                    existing_product.title = title
                    existing_product.price = price_val
                    existing_product.discount_price = discount_price_val
                    existing_product.discount_type = discount_type
                    existing_product.discount_value = discount_value
                    existing_product.stock = stock_val
                    existing_product.category = category_obj
                    if colors_data:
                        existing_product.colors_data = colors_data
                    if sizes_data:
                        existing_product.sizes_data = sizes_data
                    if dimensions:
                        existing_product.dimensions = dimensions
                    existing_product.is_active = is_active
                    existing_product.highlight_featured = highlight_featured
                    if tags:
                        existing_product.tag = tags
                    if brand:
                        existing_product.brand = brand
                    if description:
                        existing_product.description = description
                    if material:
                        existing_product.material = material
                    if weight:
                        existing_product.weight = weight
                    
                    existing_product.save()
                    updated_count += 1
                else:
                    import random
                    import string
                    base_slug = slugify(title)
                    if not base_slug:
                        base_slug = "product"
                    slug = base_slug
                    while Product.objects.filter(slug=slug).exists():
                        rand_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
                        slug = f"{base_slug}-{rand_suffix}"

                    Product.objects.create(
                        title=title,
                        slug=slug,
                        description=description or '',
                        price=price_val,
                        discount_price=discount_price_val,
                        discount_type=discount_type,
                        discount_value=discount_value,
                        stock=stock_val,
                        category=category_obj,
                        brand=brand,
                        material=material,
                        dimensions=dimensions,
                        colors_data=colors_data,
                        sizes_data=sizes_data,
                        is_active=is_active,
                        highlight_featured=highlight_featured,
                        tag=tags,
                        weight=weight,
                        vendor=request.user if request.user.is_authenticated else None
                    )
                    created_count += 1
            except Exception as e:
                import traceback
                traceback.print_exc()
                errors.append(f"Row {row_idx}: {str(e)}")
                failed_count += 1

        return Response({
            'created': created_count,
            'updated': updated_count,
            'skipped': skipped_count,
            'failed': failed_count,
            'errors': errors
        }, status=200)

    def create(self, request, *args, **kwargs):
        gallery_images = request.FILES.getlist('gallery')
        data = request.data.copy()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)

        # Save gallery images
        for img in gallery_images:
            ProductImage.objects.create(product=product, image=img)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        gallery_images = request.FILES.getlist('gallery')
        instance = self.get_object()

        # Fix Djongo bug where DecimalFields fetch Decimal128 objects which crash on save
        from bson.decimal128 import Decimal128
        for field in ['price', 'discount_price', 'discount_value']:
            val = getattr(instance, field, None)
            if isinstance(val, Decimal128):
                setattr(instance, field, val.to_decimal())

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        if gallery_images:
            for img in gallery_images:
                ProductImage.objects.create(product=product, image=img)

        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user if self.request.user.is_authenticated else None)


class ProductRequestViewSet(viewsets.ModelViewSet):
    queryset = ProductRequest.objects.all()
    serializer_class = ProductRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        is_admin = user.is_staff or str(getattr(user, 'role', '')).upper() in ('SUPER_ADMIN', 'SUPERADMIN', 'SUB_ADMIN', 'SUBADMIN', 'ADMIN')
        if is_admin:
            return ProductRequest.objects.all()
        return ProductRequest.objects.filter(vendor=user)

    def perform_create(self, serializer):
        serializer.save(vendor=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        obj = self.get_object()
        if obj.status == 'APPROVED':
            return Response({'detail': 'Request already approved'}, status=400)
        
        # Logic to convert to Master Product
        from bson.decimal128 import Decimal128
        price_val = obj.suggested_price
        if isinstance(price_val, Decimal128):
            price_val = price_val.to_decimal()

        product = Product.objects.create(
            title=obj.title,
            description=obj.description,
            price=price_val,
            category=obj.category,
            main_image=obj.image,
            vendor=None, # Master Product
            is_active=True,
            stock=0 # Start with 0 master stock
        )
        
        obj.status = 'APPROVED'
        obj.admin_notes = request.data.get('notes', 'Approved by Admin')
        obj.save()
        
        return Response({'status': 'Approved', 'product_id': str(product.id)})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        obj = self.get_object()
        obj.status = 'REJECTED'
        obj.admin_notes = request.data.get('notes', 'Rejected by Admin')
        obj.save()
        return Response({'status': 'Rejected'})
