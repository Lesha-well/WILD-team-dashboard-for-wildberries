import pandas as pd
from datetime import datetime, timedelta
import json
import os



# Мы выкинули все данные, которые шли после 7.10.2025г
def _load_data() -> dict[str, pd.DataFrame]:
    """Загрузка всех данных в pandas DataFrame для удобной обработки"""
    data = {
        'sales': pd.read_csv('Данные/sales.csv'),
        'products': pd.read_csv('Данные/products.csv'),
        'user_segments': pd.read_csv('Данные/user_segments.csv'),
        'returns': pd.read_csv('Данные/returns.csv'),
        'ad_revenue': pd.read_csv('Данные/ad_revenue.csv'),
        'events': pd.read_csv('Данные/events.csv'),
        'traffic': pd.read_csv('Данные/traffic.csv'),
        'suppliers': pd.read_csv('Данные/suppliers.csv'),
        'inventory': pd.read_csv('Данные/inventory.csv'),
        'customer_support': pd.read_csv('Данные/customer_support.csv')
    }
    return data



data = _load_data()

print(data['sales'])
print(data['products'])

sales_merged = data['sales'].merge(data['products'][['product_id', 'price', 'category', 'supplier_id']], on='product_id', how='left')
sales_merged['transaction_date'] = pd.to_datetime(sales_merged['transaction_date'])

# Объединяем sales с returns по transaction_id
sales_merged = sales_merged.merge(
    data['returns'][['reason', 'transaction_id']],
    left_on='transaction_id',
    right_on='transaction_id',
    how='left',
)


print(sales_merged)


# Прибыль
def calculate_sales(product_category=None, product_ids=None, date_from=None, date_to=None, supplier_ids=None):
    if product_category is None:
        product_category = {'Beauty', 'Clothes', 'Food', 'Electronic', 'Home'}
    if product_ids is None:
        product_ids = set(range(1, 501))
    if date_from is None:
        # Тогда берём за последний месяц
        date_from = datetime.today() - timedelta(days=30)
        date_to = datetime.today()
    if supplier_ids is None:
        supplier_ids = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20}

    sum_without_returns = 0
    sum_returns = 0
    # Количество в штуках проданных товаров и возвращённых товаров
    sales_quantity = 0 
    returns_quantity = 0
    for line in sales_merged.itertuples():
        if line.category in product_category and line.supplier_id in supplier_ids and line.product_id in product_ids and date_from <= line.transaction_date <= date_to:
            sum_without_returns += line.quantity * line.price
            sales_quantity += line.quantity
            if pd.notna(line.reason):
                sum_returns += line.quantity * line.price
                returns_quantity += line.quantity

    # Процент выкупа
    buys_perc = (sum_without_returns - sum_returns) * 100 / sum_without_returns

    return round(sum_without_returns, 2), sales_quantity, round(sum_returns, 2), returns_quantity, round(buys_perc, 2)






print(calculate_sales())

