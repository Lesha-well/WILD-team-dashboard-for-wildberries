import json
import os
import sys
import time
from datetime import datetime
import threading
import tkinter as tk
from tkinter import ttk


# -----------------------------
# Data loading and formatting
# -----------------------------

def load_latest_results(path: str = 'results.json') -> dict:
    if not os.path.exists(path):
        return {}
    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, list):
            return data[-1] if data else {}
        if isinstance(data, dict):
            return data
        return {}
    except Exception:
        return {}


def format_currency_rub(value: float | int) -> str:
    try:
        ivalue = float(value)
    except Exception:
        return '0 ₽'
    # Format with space as thousand separator for RU locale style
    s = f"{ivalue:,.0f}".replace(',', ' ').replace('\u00a0', ' ')
    return f"{s} ₽"


def format_percent(value: float | int) -> str:
    try:
        f = float(value)
    except Exception:
        return '0%'
    return f"{f:.2f}%".replace('.', ',')


# -----------------------------
# KPI computation from results.json
# -----------------------------

def compute_kpis(latest: dict) -> dict:
    sales = latest.get('sales_analysis', {})
    ads = latest.get('advertising_analysis', {})
    inv = latest.get('inventory_analysis', {})

    total_sales = float(sales.get('total_sales_without_returns') or 0)
    returns_sum = float(sales.get('total_returns') or 0)
    sales_qty = int(sales.get('sales_quantity') or 0)
    buyout = float(sales.get('buyout_percentage') or 0)

    ad_spend = float(ads.get('ad_spend') or 0)
    ad_revenue = float(ads.get('ad_revenue') or 0)
    # clicks value is available but not used in current design
    cpc = float(ads.get('cost_per_click') or 0)

    low_stock_count = int(inv.get('low_stock_count') or 0)

    net_profit = total_sales - returns_sum - ad_spend  # naive proxy
    margin_pct = (net_profit / total_sales * 100) if total_sales > 0 else 0

    roi_pct = ((ad_revenue - ad_spend) / ad_spend * 100) if ad_spend > 0 else 0

    kpis = {
        'Чистая прибыль / Марж-сть': (
            format_currency_rub(net_profit),
            f"{format_percent(margin_pct)}",
        ),
        'Прибыль / Марж-сть': (
            format_currency_rub(net_profit),
            f"{format_percent(margin_pct)}",
        ),
        'Реализация': (format_currency_rub(total_sales), ''),
        'Заказы': (
            f"{format_currency_rub(total_sales)} / {sales_qty} шт",
            '',
        ),
        'Процент выкупа': (format_percent(buyout), ''),
        'Логистие / Дрр': (format_currency_rub(0), 'N/A'),
        'Хранение': (format_currency_rub(0), '0%'),
        'Импорт': (format_currency_rub(0), '0%'),
        'Плат. приема': (format_currency_rub(0), '0%'),
        'Логистика': (format_currency_rub(0), '0%'),
        'Себестоимость продажи': (format_currency_rub(0), '0%'),
        'Опостатков': (format_currency_rub(0), '0%'),
        'ROI': (
            format_percent(roi_pct),
            f"CPC: {format_currency_rub(cpc)}",
        ),
        'Низкие остатки': (str(low_stock_count), 'товаров'),
    }
    return kpis


# -----------------------------
# UI elements
# -----------------------------

class Card(ttk.Frame):
    def __init__(
        self,
        master,
        title: str,
        value: str,
        subvalue: str = '',
        *,
        color: str = '#F9E3EE',
    ):
        super().__init__(master, padding=12)
        self.configure(style='Card.TFrame')

        # background layer
        bg = tk.Frame(self, bg=color, bd=0, highlightthickness=0)
        bg.place(relx=0, rely=0, relwidth=1, relheight=1)

        self.title_lbl = tk.Label(
            bg,
            text=title,
            font=('Segoe UI', 10, 'bold'),
            bg=color,
            fg='#4D3B5E',
        )
        self.title_lbl.pack(anchor='w')

        self.value_lbl = tk.Label(
            bg,
            text=value,
            font=('Segoe UI Semibold', 20),
            bg=color,
            fg='#1B1B1B',
        )
        self.value_lbl.pack(anchor='w', pady=(6, 0))

        if subvalue:
            self.sub_lbl = tk.Label(
                bg,
                text=subvalue,
                font=('Segoe UI', 10),
                bg=color,
                fg='#6B6B6B',
            )
            self.sub_lbl.pack(anchor='w', pady=(6, 0))
        else:
            self.sub_lbl = None

    def update_values(self, value: str, subvalue: str = '') -> None:
        self.value_lbl.configure(text=value)
        if self.sub_lbl is None and subvalue:
            # create if missing
            self.sub_lbl = tk.Label(self, text=subvalue, font=('Segoe UI', 10))
            self.sub_lbl.pack(anchor='w', pady=(6, 0))
        if self.sub_lbl is not None:
            self.sub_lbl.configure(text=subvalue)


class DashboardApp(tk.Tk):
    def __init__(self, results_path: str = 'results.json'):
        super().__init__()
        self.title('Malinka — Dashboard')
        self.geometry('1200x700')
        self.configure(bg='#F3EBFF')

        self.results_path = results_path
        self.last_mtime = 0

        self._build_header()
        self._build_filters()
        self._build_cards()

        self._refresh_data()
        self._start_watcher()

    # Header with title and date range (readonly)
    def _build_header(self):
        header = tk.Frame(self, bg='#6F52ED', padx=16, pady=12)
        header.pack(fill='x')

        logo = tk.Label(
            header,
            text='🍓 Malinka',
            bg='#6F52ED',
            fg='white',
            font=('Segoe UI Semibold', 16),
        )
        logo.pack(side='left')

        self.range_lbl = tk.Label(
            header,
            text='Период: авто (последние расчёты)',
            bg='#6F52ED',
            fg='white',
            font=('Segoe UI', 10),
        )
        self.range_lbl.pack(side='left', padx=16)

        self.refresh_btn = ttk.Button(
            header,
            text='Обновить',
            command=self._refresh_data,
        )
        self.refresh_btn.pack(side='right')

    # Filter bar (non-functional placeholders)
    def _build_filters(self):
        bar = tk.Frame(self, bg='#F3EBFF')
        bar.pack(fill='x', padx=16, pady=8)

        for txt in ('Бренды', 'Категории', 'Группы', 'Артикулы'):
            ttk.Button(bar, text=txt).pack(side='left', padx=(0, 8))

    def _build_cards(self):
        container = tk.Frame(self, bg='#F3EBFF')
        container.pack(fill='both', expand=True, padx=16, pady=(0, 16))

        self.grid_container = ttk.Frame(container)
        self.grid_container.pack(fill='both', expand=True)
        self.grid_container.columnconfigure((0, 1, 2), weight=1, uniform='col')

        self.cards: dict[str, Card] = {}

        # Define rows of cards to resemble mockup
        palette = [
            '#FDE7EF', '#FDEBF7', '#F2E8FF', '#E9F1FF', '#E8FFF4', '#FFF8E7'
        ]

        titles = [
            'Чистая прибыль / Марж-сть', 'Прибыль / Марж-сть', 'Реализация',
            'Заказы', 'Процент выкупа', 'Логистие / Дрр',
            'Хранение', 'Импорт', 'Плат. приема',
            'Логистика', 'Себестоимость продажи', 'Опостатков',
            'ROI', 'Низкие остатки'
        ]

        row, col = 0, 0
        for idx, title in enumerate(titles):
            color = palette[idx % len(palette)]
            card = Card(self.grid_container, title, '—', '', color=color)
            card.grid(row=row, column=col, sticky='nsew', padx=8, pady=8)
            self.grid_container.columnconfigure(col, weight=1)
            self.cards[title] = card

            col += 1
            if col > 2:
                col = 0
                row += 1

    def _refresh_data(self):
        latest = load_latest_results(self.results_path)
        if not latest:
            # No data yet
            for card in self.cards.values():
                card.update_values('—', '')
            return

        kpis = compute_kpis(latest)
        ts = latest.get('timestamp')
        try:
            display_dt = (
                datetime.fromisoformat(ts).strftime('%d.%m.%Y %H:%M')
                if ts else '—'
            )
        except Exception:
            display_dt = ts or '—'
        self.range_lbl.configure(text=f'Последние расчёты: {display_dt}')

        for title, card in self.cards.items():
            value, sub = kpis.get(title, ('—', ''))
            card.update_values(value, sub)

    def _start_watcher(self):
        def watch():
            while True:
                try:
                    if os.path.exists(self.results_path):
                        mtime = os.path.getmtime(self.results_path)
                        if mtime != self.last_mtime:
                            self.last_mtime = mtime
                            self.after(0, self._refresh_data)
                    time.sleep(2)
                except Exception:
                    time.sleep(2)
        t = threading.Thread(target=watch, daemon=True)
        t.start()


def main():
    app = DashboardApp()
    try:
        app.mainloop()
    except KeyboardInterrupt:
        sys.exit(0)


if __name__ == '__main__':
    main()
