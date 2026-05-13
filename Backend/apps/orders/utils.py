import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch

def generate_bulk_order_invoice_pdf(order_data):
    """
    Generates a PDF invoice for a bulk order.
    order_data is expected to be a dictionary (serialized order).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    elements = []
    
    styles = getSampleStyleSheet()
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.hexColor('#059669'), # Emerald 600
        spaceAfter=12
    )
    
    label_style = styles['Normal']
    
    # 1. Header (Company Name)
    elements.append(Paragraph("NEXTGEN SMART STORE", header_style))
    elements.append(Paragraph("Wholesale Division - Digital Tax Invoice", styles['Heading4']))
    elements.append(Spacer(1, 0.2 * inch))
    
    # 2. Basic Info Table
    order_id = str(order_data.get('id', 'N/A')).upper()
    info_data = [
        [Paragraph(f"<b>ORDER ID:</b> #{order_id[:8]}", label_style), Paragraph(f"<b>DATE:</b> {order_data.get('created_at', 'N/A')[:10]}", label_style)],
        [Paragraph(f"<b>VENDOR:</b> {order_data.get('vendor_email', 'Unknown')}", label_style), Paragraph(f"<b>STATUS:</b> {order_data.get('status', 'PENDING').upper()}", label_style)]
    ]
    
    info_table = Table(info_data, colWidths=[3*inch, 3*inch])
    info_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 0.4 * inch))
    
    # 3. Items Table
    elements.append(Paragraph("ORDER MANIFEST", styles['Heading3']))
    elements.append(Spacer(1, 0.1 * inch))
    
    items = order_data.get('items', [])
    if items:
        table_data = [['#', 'PRODUCT NAME', 'QTY', 'UNIT PRICE', 'SUBTOTAL']]
        total_qty = 0
        for i, item in enumerate(items, 1):
            details = item.get('product_details', {})
            title = details.get('title', 'Unknown Item')
            qty = item.get('quantity', 0)
            price = float(item.get('price', 0))
            subtotal = qty * price
            total_qty += qty
            table_data.append([
                str(i),
                Paragraph(title, styles['Normal']),
                str(qty),
                f"${price:,.2f}",
                f"${subtotal:,.2f}"
            ])
        
        # Add summary row
        table_data.append(['', 'TOTAL QUANTITY', str(total_qty), 'GRAND TOTAL', f"${float(order_data.get('total_amount', 0)):,.2f}"])
        
        manifest_table = Table(table_data, colWidths=[0.5*inch, 2.5*inch, 0.8*inch, 1.2*inch, 1.2*inch])
        manifest_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.hexColor('#F9FAFB')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.hexColor('#374151')),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 10),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-2), 0.5, colors.grey),
            ('LINEBELOW', (0,-1), (-1,-1), 1, colors.black),
            ('FONTNAME', (-2,-1), (-1,-1), 'Helvetica-Bold'), # Style total row
        ]))
        elements.append(manifest_table)
    else:
        elements.append(Paragraph("No items recorded in this manifest.", styles['Italic']))

    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph("Thank you for your business with NextGen Smart Store.", styles['Normal']))
    elements.append(Paragraph("This is a computer-generated invoice and does not require a physical signature.", styles['SmallText'] if 'SmallText' in styles else styles['Italic']))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
