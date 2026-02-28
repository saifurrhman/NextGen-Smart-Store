import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

from django.db import connection

def clean_db():
    print("Dropping corrupted MongoDB collections...")
    db = connection.connection
    
    # Drop the collections
    db.products_product.drop()
    db.orders_order.drop()
    db.orders_orderitem.drop()
    db.finance_transaction.drop()
    
    # Remove from django_migrations table
    db.django_migrations.delete_many({'app': {'$in': ['products', 'orders', 'finance']}})
    print("Collections dropped and migrations cleared!")

if __name__ == '__main__':
    clean_db()
