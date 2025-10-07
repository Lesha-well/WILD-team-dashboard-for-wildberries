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


sales_merged = data['sales'].merge(data['products'][['product_id', 'price', 'category', 'supplier_id']], on='product_id', how='left')
sales_merged['transaction_date'] = pd.to_datetime(sales_merged['transaction_date'])

# Объединяем sales с returns по transaction_id
sales_merged = sales_merged.merge(
    data['returns'][['reason', 'transaction_id']],
    left_on='transaction_id',
    right_on='transaction_id',
    how='left',
)



# Прибыль
def calculate_sales(product_category=None, product_ids=None, date_from=None, date_to=None, supplier_ids=None):
    if product_category is None:
        product_category = {'Beauty', 'Clothes', 'Food', 'Electronics', 'Home'}
    if product_ids is None:
        product_ids = set(range(1, 501))
    if date_from is None:
        # Тогда берём за последний месяц
        date_from = datetime.today() - timedelta(days=30)
        date_to = datetime.today()
    if supplier_ids is None:
        supplier_ids = set(range(1, 21))

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
    if sum_without_returns != 0:
        buys_perc = (sum_without_returns - sum_returns) * 100 / sum_without_returns
    else:
        buys_perc = 0
    return int(sum_without_returns), sales_quantity, int(sum_returns), returns_quantity, int(buys_perc)




products_merged_inventory = data['products'][['product_id', 'product_name', 'category']].merge(
    data['inventory'],
    on='product_id',
    how='left'
)
products_merged_inventory['last_updated'] = pd.to_datetime(products_merged_inventory['last_updated'])



def calculate_ost(product_category=None, product_ids=None, date_from=None, date_to=None, low_ost_flag=250):
    if product_category is None:
        product_category = {'Beauty', 'Clothes', 'Food', 'Electronics', 'Home'}
    if product_ids is None:
        product_ids = set(range(1, 501))
    if date_from is None:
        # Тогда берём за последний месяц
        date_from = datetime.today() - timedelta(days=30)
        date_to = datetime.today()

    # Товары с мелким остатком + остаток
    low_ost = {line.product_id: int(line.stock_quantity) for line in products_merged_inventory.itertuples() if
    line.category in product_category and line.product_id in product_ids and pd.notna(line.stock_quantity) and pd.notna(line.stock_quantity) and line.stock_quantity <= low_ost_flag and date_from <= line.last_updated <= date_to}

    return low_ost



# 
# Потом добавить, чтобы если были вот так остатки:
# Хиты продаж: высокие продажи + низкие остатки = срочное пополнение
# Стабильные: средние продажи + средние остатки = плановое пополнение
# Неликвиды: низкие продажи + высокие остатки = стоп закупки
# 


def calculate_ad(product_category=None, product_ids=None, date_from=None, date_to=None):
    if product_category is None:
        product_category = {'Beauty', 'Clothes', 'Food', 'Electronics', 'Home'}
    if product_ids is None:
        product_ids = set(range(1, 501))
    if date_from is None:
        # Тогда берём за последний месяц
        date_from = datetime.today() - timedelta(days=30)
        date_to = datetime.today()
    
    # расходы на рекламу
    ad_spend = 0
    ad_revenue = 0
    clicls_count = 0
    for line in ad_merged.itertuples():
        if line.category in product_category and line.product_id in product_ids and date_from <= line.date <= date_to:
            ad_spend += line.spend
            ad_revenue += line.revenue
            clicls_count += line.clicks
    
    return int(ad_spend), int(ad_revenue), clicls_count, (int(ad_spend / clicls_count) if clicls_count != 0 else 0)


ad_merged = data['products'][['product_id', 'category']].merge(
    data['ad_revenue'],
    on='product_id',
    how='left'
)
ad_merged['date'] = pd.to_datetime(ad_merged['date'])







def save_results_to_json(filename='results.json'):
    """Сохранение результатов всех расчётов в JSON файл"""
    
    # Получаем результаты всех функций
    sales_result = calculate_sales()
    ad_result = calculate_ad()
    ost_result = calculate_ost()
    
    # Формируем структуру данных для JSON
    results = {
        'sales_analysis': {
            'total_sales_without_returns': sales_result[0],
            'sales_quantity': sales_result[1],
            'total_returns': sales_result[2],
            'returns_quantity': sales_result[3],
            'buyout_percentage': sales_result[4]
        },
        'advertising_analysis': {
            'ad_spend': ad_result[0],
            'ad_revenue': ad_result[1],
            'clicks_count': ad_result[2],
            'cost_per_click': ad_result[3]
        },
        'inventory_analysis': {
            'low_stock_products': ost_result,
            'low_stock_count': len(ost_result)
        }
    }
    
    # Читаем существующий файл и обновляем (добавляем запись), вместо перезаписи
    existing_data = []
    if os.path.exists(filename):
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
            if isinstance(loaded, list):
                existing_data = loaded
            elif isinstance(loaded, dict):
                # Миграция старого формата (один объект) в список
                existing_data = [loaded]
        except Exception:
            # Если файл повреждён/пустой — начинаем заново со списком
            existing_data = []

    existing_data.append(results)

    # Сохраняем обновлённый список записей в JSON файл
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, ensure_ascii=False, indent=2)
    
    print(f"Результаты обновлены в файле: {filename}")
    return results


# Выполняем расчёты и сохраняем результаты
# if __name__ == "__main__":
#     results = save_results_to_json()

print(calculate_sales(date_from=datetime.today() - timedelta(days=365), date_to=datetime.today()))
print('\n\n\n\n')
for i in ('Beauty', 'Clothes', 'Food', 'Electronics', 'Home'):
    print(calculate_sales(product_category=i, date_from=datetime.today() - timedelta(days=7), date_to=datetime.today()))

