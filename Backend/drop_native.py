from pymongo import MongoClient

def clean_db():
    print("Connecting to PyMongo...")
    client = MongoClient('mongodb://localhost:27017/')
    db = client['nextgen_smart_store']
    
    # Drop the collections directly
    db.products_product.drop()
    db.orders_order.drop()
    db.orders_orderitem.drop()
    db.finance_transaction.drop()
    
    # Remove from django_migrations table
    db.django_migrations.delete_many({'app': {'$in': ['products', 'orders', 'finance']}})
    print("Collections dropped and migrations cleared using PyMongo natively!")

if __name__ == '__main__':
    clean_db()
