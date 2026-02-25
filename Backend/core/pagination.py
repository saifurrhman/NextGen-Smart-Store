from django.core.paginator import Paginator
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MongoPaginator(Paginator):
    """
    Overriding Django's Paginator to handle Djongo's count() issues.
    """
    @property
    def count(self):
        """
        Return the total number of objects, across all pages.
        """
        print("DEBUG: MongoPaginator.count called")
        return len(self.object_list)

class MongoPagination(PageNumberPagination):
    """
    Custom pagination for MongoDB/Djongo compatibility.
    """
    django_paginator_class = MongoPaginator
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

    def paginate_queryset(self, queryset, request, view=None):
        """
        Override to force usage of MongoPaginator and log it.
        """
        print("DEBUG: MongoPagination.paginate_queryset called")
        self.request = request
        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        page_number = request.query_params.get(self.page_query_param, 1)

        try:
            self.page = paginator.page(page_number)
        except Exception as e:
            # If standard pagination fails, return full list or empty
            # But MongoPaginator.count should have handled it.
            print(f"DEBUG: Pagination error: {e}")
            raise e

        if paginator.num_pages > 1 and self.template is not None:
            # The template context needs the page object
            self.display_page_controls = True

        return list(self.page)

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })
