// Enhanced Analytics Dashboard App for Malinka
class AnalyticsDashboard {
    constructor() {
        this.data = null;
        this.currentPeriod = 'Year';
        this.currentCategory = 'all';
        this.charts = {};
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderDashboard();
    }

    async loadData() {
        this.data = {
            "period_info": {
                "year_description": "Период с 1 января 2025 по 7 октября 2025",
                "total_days": 280,
                "months_2025": ["Янв 2025", "Фев 2025", "Мар 2025", "Апр 2025", "Май 2025", "Июн 2025", "Июл 2025", "Авг 2025", "Сен 2025", "Окт 2025"]
            },
            "metrics": {
                "operational_expenses": {
                    "Year": {"all": 48273615, "Beauty": 12486321, "Clothes": 8926143, "Electronics": 9024164},
                    "Month": {"all": 4019523, "Beauty": 1038254, "Clothes": 744218, "Electronics": 754841},
                    "Week": {"all": 1004881, "Beauty": 259563, "Clothes": 187624, "Electronics": 187704}
                },
                "orders": {
                    "Year": {"all": 1835129342, "all_quantity": 458214, "avg_order_value": 4006},
                    "Month": {"all": 152927445, "all_quantity": 38120, "avg_order_value": 4011},
                    "Week": {"all": 38231861, "all_quantity": 9530, "avg_order_value": 4012}
                },
                "realization": {
                    "Year": {"all": 3654219284, "change_percent": 8.0},
                    "Month": {"all": 304518827, "change_percent": 8.0},
                    "Week": {"all": 76129706, "change_percent": 8.0}
                },
                "logistics": {
                    "Year": {"all": 128736458, "percent": 8.5, "average_delivery_days": 2.1, "change_percent": 6.0},
                    "Month": {"all": 10731371, "percent": 8.5, "average_delivery_days": 2.1, "change_percent": 6.0},
                    "Week": {"all": 2682843, "percent": 8.5, "average_delivery_days": 2.1, "change_percent": 6.0}
                },
                "taxes": {
                    "Year": {"all": 657759472, "percent": 18.0, "nds": 483878568, "income_tax": 173880904, "change_percent": 2.5},
                    "Month": {"all": 54813289, "percent": 18.0, "nds": 40323214, "income_tax": 14490075, "change_percent": 2.5},
                    "Week": {"all": 13703322, "percent": 18.0, "nds": 10080803, "income_tax": 3622519, "change_percent": 2.5}
                },
                "advertising": {
                    "Year": {"all": 292337543, "percent": 8.0, "roi": 4.2, "change_percent": 12.0},
                    "Month": {"all": 24361462, "percent": 8.0, "roi": 4.2, "change_percent": 12.0},
                    "Week": {"all": 6090365, "percent": 8.0, "roi": 4.2, "change_percent": 12.0}
                },
                "roi": {
                    "Year": {"percent": 13.5, "change_percent": 1.2},
                    "Month": {"percent": 13.5, "change_percent": 1.2},
                    "Week": {"percent": 13.5, "change_percent": 1.2}
                },
                "storage": {
                    "Year": {"all": 11243891, "avg_per_item": 24, "warehouse_count": 6, "change_percent": 3.2},
                    "Month": {"all": 937231, "avg_per_item": 23, "warehouse_count": 6, "change_percent": 3.2},
                    "Week": {"all": 234308, "avg_per_item": 22, "warehouse_count": 6, "change_percent": 3.2}
                },
                "cost_of_sales": {
                    "Year": {"all": 1863451774, "percent": 51.0, "change_percent": -1.8},
                    "Month": {"all": 155287648, "percent": 51.0, "change_percent": -1.8},
                    "Week": {"all": 38821912, "percent": 51.0, "change_percent": -1.8}
                }
            },
            "category_metrics": {
                "Beauty": {
                    "Year": {
                        "realization_all": 12514071, "realization_change_percent": 8.0,
                        "orders_all_quantity": 97998, "orders_avg_order_value": 127,
                        "roi_percent": 13.5, "roi_change_percent": 1.2,
                        "advertising_all": 1001125, "advertising_roi": 4.2, "advertising_change_percent": 12.0,
                        "taxes_all": 2252532, "taxes_percent": 18.0, "taxes_change_percent": 2.5,
                        "logistics_all": 1063844, "logistics_percent": 8.5, "logistics_change_percent": 6.0, "logistics_delivery_days": 2.1,
                        "storage_all": 375422, "storage_change_percent": 3.2,
                        "cost_of_sales_all": 6382435, "cost_of_sales_percent": 51.0, "cost_of_sales_change_percent": -1.8
                    },
                    "Month": {
                        "realization_all": 1042839, "realization_change_percent": 8.0,
                        "orders_all_quantity": 8166, "roi_percent": 13.5,
                        "advertising_all": 83427, "advertising_roi": 4.2, "advertising_change_percent": 12.0,
                        "taxes_all": 187711, "taxes_change_percent": 2.5,
                        "logistics_all": 88654, "logistics_delivery_days": 2.1, "logistics_change_percent": 6.0,
                        "storage_all": 31285, "cost_of_sales_all": 531869
                    },
                    "Week": {
                        "realization_all": 260710, "realization_change_percent": 8.0,
                        "orders_all_quantity": 2041, "roi_percent": 13.5,
                        "advertising_all": 20857, "advertising_roi": 4.2,
                        "taxes_all": 46928, "logistics_all": 22164, "logistics_delivery_days": 2.1,
                        "storage_all": 7821, "cost_of_sales_all": 132967
                    }
                },
                "Clothes": {
                    "Year": {
                        "realization_all": 11384458, "realization_change_percent": 8.0,
                        "orders_all_quantity": 89297, "orders_avg_order_value": 127,
                        "roi_percent": 14.1, "roi_change_percent": 1.2,
                        "advertising_all": 910756, "advertising_roi": 4.0, "advertising_change_percent": 12.0,
                        "taxes_all": 2049202, "taxes_percent": 18.0, "taxes_change_percent": 2.5,
                        "logistics_all": 967679, "logistics_percent": 8.5, "logistics_change_percent": 6.0, "logistics_delivery_days": 2.1,
                        "storage_all": 341534, "storage_change_percent": 3.2,
                        "cost_of_sales_all": 5806073, "cost_of_sales_percent": 51.0, "cost_of_sales_change_percent": -1.8
                    },
                    "Month": {
                        "realization_all": 948705, "realization_change_percent": 8.0,
                        "orders_all_quantity": 7441, "roi_percent": 14.1,
                        "advertising_all": 75896, "advertising_roi": 4.0,
                        "taxes_all": 170767, "taxes_change_percent": 2.5,
                        "logistics_all": 80640, "logistics_delivery_days": 2.1, "logistics_change_percent": 6.0,
                        "storage_all": 28461, "cost_of_sales_all": 483840
                    },
                    "Week": {
                        "realization_all": 237176, "realization_change_percent": 8.0,
                        "orders_all_quantity": 1860, "roi_percent": 14.1,
                        "advertising_all": 18974, "advertising_roi": 4.0,
                        "taxes_all": 42692, "logistics_all": 20160, "logistics_delivery_days": 2.1,
                        "storage_all": 7115, "cost_of_sales_all": 120960
                    }
                },
                "Electronics": {
                    "Year": {
                        "realization_all": 13664246, "realization_change_percent": 8.0,
                        "orders_all_quantity": 107295, "orders_avg_order_value": 127,
                        "roi_percent": 12.8, "roi_change_percent": 1.2,
                        "advertising_all": 1093139, "advertising_roi": 3.9, "advertising_change_percent": 12.0,
                        "taxes_all": 2459564, "taxes_percent": 18.0, "taxes_change_percent": 2.5,
                        "logistics_all": 1161461, "logistics_percent": 8.5, "logistics_change_percent": 6.0, "logistics_delivery_days": 2.1,
                        "storage_all": 409927, "storage_change_percent": 3.2,
                        "cost_of_sales_all": 6968766, "cost_of_sales_percent": 51.0, "cost_of_sales_change_percent": -1.8
                    },
                    "Month": {
                        "realization_all": 1138687, "realization_change_percent": 8.0,
                        "orders_all_quantity": 8941, "roi_percent": 12.8,
                        "advertising_all": 91095, "advertising_roi": 3.9,
                        "taxes_all": 204964, "taxes_change_percent": 2.5,
                        "logistics_all": 96789, "logistics_delivery_days": 2.1, "logistics_change_percent": 6.0,
                        "storage_all": 34161, "cost_of_sales_all": 580731
                    },
                    "Week": {
                        "realization_all": 284672, "realization_change_percent": 8.0,
                        "orders_all_quantity": 2235, "roi_percent": 12.8,
                        "advertising_all": 22774, "advertising_roi": 3.9,
                        "taxes_all": 51241, "logistics_all": 24197, "logistics_delivery_days": 2.1,
                        "storage_all": 8540, "cost_of_sales_all": 145183
                    }
                }
            },
            "campaigns_by_category": {
                "Beauty": [
                    {"name": "Кампания Beauty 1", "spend": 28451, "revenue": 113805, "roas": 4.0, "ctr": 2.78, "impressions": 156743, "clicks": 4358},
                    {"name": "Кампания Beauty 2", "spend": 31246, "revenue": 109359, "roas": 3.5, "ctr": 2.8, "impressions": 142356, "clicks": 3982},
                    {"name": "Кампания Beauty 3", "spend": 22135, "revenue": 88540, "roas": 4.0, "ctr": 2.81, "impressions": 125789, "clicks": 3536},
                    {"name": "Кампания Beauty 4", "spend": 26832, "revenue": 91084, "roas": 3.4, "ctr": 2.65, "impressions": 134562, "clicks": 3567},
                    {"name": "Кампания Beauty 5", "spend": 19845, "revenue": 83459, "roas": 4.2, "ctr": 3.12, "impressions": 108934, "clicks": 3399},
                    {"name": "Кампания Beauty 6", "spend": 33567, "revenue": 129834, "roas": 3.9, "ctr": 2.94, "impressions": 167823, "clicks": 4935}
                ],
                "Clothes": [
                    {"name": "Кампания Clothes 1", "spend": 35678, "revenue": 132047, "roas": 3.7, "ctr": 2.45, "impressions": 178934, "clicks": 4384},
                    {"name": "Кампания Clothes 2", "spend": 29867, "revenue": 104537, "roas": 3.5, "ctr": 2.73, "impressions": 167892, "clicks": 4589},
                    {"name": "Кампания Clothes 3", "spend": 41234, "revenue": 144567, "roas": 3.5, "ctr": 2.89, "impressions": 189456, "clicks": 5475},
                    {"name": "Кампания Clothes 4", "spend": 24689, "revenue": 96834, "roas": 3.9, "ctr": 3.15, "impressions": 134567, "clicks": 4240},
                    {"name": "Кампания Clothes 5", "spend": 37845, "revenue": 138945, "roas": 3.7, "ctr": 2.67, "impressions": 156789, "clicks": 4186},
                    {"name": "Кампания Clothes 6", "spend": 28934, "revenue": 107648, "roas": 3.7, "ctr": 2.98, "impressions": 145623, "clicks": 4340}
                ],
                "Electronics": [
                    {"name": "Кампания Electronics 1", "spend": 45678, "revenue": 168145, "roas": 3.7, "ctr": 2.34, "impressions": 198234, "clicks": 4638},
                    {"name": "Кампания Electronics 2", "spend": 38945, "revenue": 139834, "roas": 3.6, "ctr": 2.56, "impressions": 178945, "clicks": 4581},
                    {"name": "Кампания Electronics 3", "spend": 52341, "revenue": 188634, "roas": 3.6, "ctr": 2.78, "impressions": 234567, "clicks": 6521},
                    {"name": "Кампania Electronics 4", "spend": 34567, "revenue": 124534, "roas": 3.6, "ctr": 3.02, "impressions": 156789, "clicks": 4735},
                    {"name": "Кампания Electronics 5", "spend": 41234, "revenue": 152834, "roas": 3.7, "ctr": 2.89, "impressions": 189456, "clicks": 5475},
                    {"name": "Кампания Electronics 6", "spend": 29876, "revenue": 114567, "roas": 3.8, "ctr": 2.45, "impressions": 145623, "clicks": 3568}
                ]
            },
            "monthly_trends": {
                "Beauty": [1142456, 1198734, 1234567, 1289012, 1345678, 1298765, 1376543, 1412890, 1467234, 1523456],
                "Clothes": [1048592, 1095847, 1156283, 1198374, 1267845, 1189652, 1298374, 1334756, 1389045, 1423567],
                "Electronics": [1356789, 1423456, 1467890, 1512345, 1589012, 1534567, 1612890, 1658234, 1712567, 1789123]
            },
            "funnel": {
                "funnel_data": [
                    {"category": "Beauty", "stages": [{"name": "Просмотры категории", "value": 66706}, {"name": "Переходы в карточку", "value": 17540}, {"name": "Добавления в корзину", "value": 2631}, {"name": "Оформленные заказы", "value": 1184}, {"name": "Выкупленные заказы", "value": 994}]},
                    {"category": "Clothes", "stages": [{"name": "Просмотры категории", "value": 55680}, {"name": "Переходы в карточку", "value": 15360}, {"name": "Добавления в корзину", "value": 2304}, {"name": "Оформленные заказы", "value": 1037}, {"name": "Выкупленные заказы", "value": 871}]},
                    {"category": "Electronics", "stages": [{"name": "Просмотры категории", "value": 11724}, {"name": "Переходы в карточку", "value": 2873}, {"name": "Добавления в корзину", "value": 431}, {"name": "Оформленные заказы", "value": 194}, {"name": "Выкупленные заказы", "value": 162}]}
                ]
            },
            "chart_colors": ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B']
        };
    }

    setupEventListeners() {
        // Date filter buttons
        document.querySelectorAll('.date-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.date-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentPeriod = e.target.dataset.period;
                this.renderDashboard();
            });
        });

        // Category filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentCategory = e.target.value;
            this.renderDashboard();
        });

        // Back button in modal
        document.getElementById('backBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal on outside click - FIXED
        const modal = document.getElementById('detailModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    formatNumber(num, isRuble = false, isPercent = false) {
        if (num === null || num === undefined) return '—';
        
        if (isPercent) {
            return `${num.toLocaleString('ru-RU', {minimumFractionDigits: 1, maximumFractionDigits: 1})}%`;
        }
        
        if (isRuble) {
            return `${Math.round(num).toLocaleString('ru-RU')} ₽`;
        }
        
        return Math.round(num).toLocaleString('ru-RU');
    }

    getCategoryFilteredData(metricKey, field = 'all') {
        const metric = this.data.metrics[metricKey];
        if (!metric || !metric[this.currentPeriod]) return null;
        
        if (this.currentCategory === 'all') {
            return metric[this.currentPeriod][field];
        }
        
        // Get category-specific data
        const categoryData = this.data.category_metrics[this.currentCategory];
        if (categoryData && categoryData[this.currentPeriod]) {
            const categoryField = `${metricKey}_${field}`;
            return categoryData[this.currentPeriod][categoryField] || categoryData[this.currentPeriod][field] || metric[this.currentPeriod][field];
        }
        
        return metric[this.currentPeriod][field];
    }

    getMetricData(metricKey, field = 'all') {
        return this.getCategoryFilteredData(metricKey, field);
    }

    createMetricWidget(title, value, change, description, icon, metricKey) {
        const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
        const changeArrow = change > 0 ? '↗' : change < 0 ? '↘' : '→';
        
        return `
            <div class="metric-widget card" data-metric="${metricKey}">
                <div class="metric-header">
                    <h3 class="metric-title">${title}</h3>
                    <div class="metric-icon">${icon}</div>
                </div>
                <div class="metric-value">${value}</div>
                <div class="metric-change ${changeClass}">
                    <span class="change-arrow">${changeArrow}</span>
                    <span>${Math.abs(change).toFixed(1)}%</span>
                </div>
                <div class="metric-description">${description}</div>
            </div>
        `;
    }

    createSalesFunnelWidget() {
        const funnelData = this.getFunnelData();
        if (!funnelData || funnelData.length === 0) return '';

        const aggregatedStages = {};
        
        if (this.currentCategory === 'all') {
            funnelData.forEach(category => {
                category.stages.forEach((stage, index) => {
                    if (!aggregatedStages[stage.name]) {
                        aggregatedStages[stage.name] = 0;
                    }
                    aggregatedStages[stage.name] += stage.value;
                });
            });
        } else {
            const categoryData = funnelData.find(item => item.category === this.currentCategory);
            if (categoryData) {
                categoryData.stages.forEach(stage => {
                    aggregatedStages[stage.name] = stage.value;
                });
            }
        }

        const stages = Object.entries(aggregatedStages).slice(0, 3);
        
        return `
            <div class="metric-widget card funnel-widget" data-metric="sales_funnel">
                <div class="metric-header">
                    <h3 class="metric-title">Воронка продаж</h3>
                    <div class="metric-icon">🔻</div>
                </div>
                <div class="funnel-preview">
                    ${stages.map(([name, value]) => `
                        <div class="funnel-stage">
                            <span class="funnel-stage-name">${name}</span>
                            <span class="funnel-stage-value">${this.formatNumber(value)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="metric-description">Конверсия по этапам воронки</div>
            </div>
        `;
    }

    getFunnelData() {
        return this.data.funnel.funnel_data;
    }

    renderDashboard() {
        const metricsGrid = document.querySelector('.metrics-grid');
        
        // Get period-aware change percentages
        let revenueChange = 8.0; // Fixed to 8% as requested
        let logisticsChange = 6.0; // Fixed to 6% as requested
        let roiPercent = this.currentCategory === 'all' ? 13.5 : this.getCategoryData('roi_percent') || 13.5;
        let advertisingChange = 12.0; // Fixed to ~12% as requested
        let taxChange = 2.5; // Fixed to ~2.5% as requested
        let costOfSalesChange = -1.8; // Fixed to -1.8% as requested

        const widgets = [
            this.createMetricWidget(
                'Общая выручка',
                this.formatNumber(this.getMetricData('realization'), true),
                revenueChange,
                `Выручка за ${this.currentPeriod === 'Year' ? 'год (янв-окт 2025)' : this.currentPeriod === 'Month' ? 'месяц' : 'неделю'}`,
                '💰',
                'realization'
            ),
            this.createMetricWidget(
                'Заказы',
                this.formatNumber(this.getMetricData('orders', 'all_quantity')),
                1.2,
                `Средний чек: ${this.formatNumber(this.getMetricData('orders', 'avg_order_value'), true)}`,
                '📦',
                'orders'
            ),
            this.createMetricWidget(
                'Операционные расходы',
                this.formatNumber(this.getMetricData('operational_expenses'), true),
                -2.1,
                'Основные расходы компании',
                '💸',
                'operational_expenses'
            ),
            this.createMetricWidget(
                'Логистика',
                this.formatNumber(this.getMetricData('logistics'), true),
                logisticsChange,
                `Среднее время доставки: ${this.getMetricData('logistics', 'average_delivery_days')} дн.`,
                '🚚',
                'logistics'
            ),
            this.createMetricWidget(
                'ROI',
                this.formatNumber(roiPercent, false, true),
                this.getMetricData('roi', 'change_percent') || 1.2,
                'Рентабельность инвестиций',
                '📈',
                'roi'
            ),
            this.createMetricWidget(
                'Реклама',
                this.formatNumber(this.getMetricData('advertising'), true),
                advertisingChange,
                `ROI рекламы: ${this.formatNumber(this.getMetricData('advertising', 'roi'), false)}x`,
                '📢',
                'advertising'
            ),
            this.createMetricWidget(
                'Налоги',
                this.formatNumber(this.getMetricData('taxes'), true),
                taxChange,
                'НДС и налог на прибыль (18% от выручки)',
                '🏛️',
                'taxes'
            ),
            this.createMetricWidget(
                'Склад',
                this.formatNumber(this.getMetricData('storage'), true),
                this.getMetricData('storage', 'change_percent') || 3.2,
                `Складов: ${this.getMetricData('storage', 'warehouse_count')}`,
                '🏭',
                'storage'
            ),
            this.createMetricWidget(
                'Анализ себестоимости',
                this.formatNumber(this.getMetricData('cost_of_sales'), true),
                costOfSalesChange,
                `${this.formatNumber(this.getMetricData('cost_of_sales', 'percent'), false, true)} от выручки`,
                '💼',
                'cost_of_sales'
            ),
            this.createSalesFunnelWidget(),
            
        ].filter(widget => widget);

        metricsGrid.innerHTML = widgets.join('');

        // Add click listeners to widgets
        document.querySelectorAll('.metric-widget').forEach(widget => {
            widget.addEventListener('click', (e) => {
                const metricKey = e.currentTarget.dataset.metric;
                this.showDetailedView(metricKey);
            });
        });
    }

    getCategoryData(field) {
        if (this.currentCategory === 'all') return null;
        const categoryData = this.data.category_metrics[this.currentCategory];
        if (categoryData && categoryData[this.currentPeriod]) {
            return categoryData[this.currentPeriod][field];
        }
        return null;
    }

    showDetailedView(metricKey) {
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const detailContent = document.getElementById('detailContent');

        const titles = {
            'realization': 'Анализ выручки',
            'orders': 'Анализ заказов',
            'operational_expenses': 'Операционные расходы',
            'logistics': 'Логистическая аналитика',
            'roi': 'ROI анализ',
            'advertising': 'Рекламная аналитика',
            'taxes': 'Налоговая отчётность',
            'storage': 'Складская аналитика',
            'sales_funnel': 'Воронка продаж',
            'cost_of_sales': 'Анализ себестоимости',
            'cost_of_sales_analysis': 'Себестоимость продаж'
        };

        modalTitle.textContent = titles[metricKey] || 'Детальная информация';
        detailContent.innerHTML = this.generateDetailedContent(metricKey);

        modal.classList.remove('hidden');

        setTimeout(() => {
            this.initializeDetailCharts(metricKey);
        }, 100);
    }

    generateDetailedContent(metricKey) {
        switch (metricKey) {
            case 'realization':
                return this.generateRevenueContent();
            case 'orders':
                return this.generateOrdersContent();
            case 'operational_expenses':
                return this.generateExpensesContent();
            case 'logistics':
                return this.generateLogisticsContent();
            case 'roi':
                return this.generateROIContent();
            case 'advertising':
                return this.generateAdvertisingContent();
            case 'taxes':
                return this.generateTaxesContent();
            case 'storage':
                return this.generateStorageContent();
            case 'sales_funnel':
                return this.generateFunnelContent();
            case 'cost_of_sales':
            case 'cost_of_sales_analysis':
                return this.generateCostOfSalesContent();
            default:
                return '<p>Данные недоступны</p>';
        }
    }

    generateRevenueContent() {
        const revenueData = this.getMetricData('realization');
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Общая выручка (${this.currentPeriod === 'Year' ? 'янв-окт 2025' : this.currentPeriod})</div>
                    <div class="kpi-value">${this.formatNumber(revenueData, true)}</div>
                    <div class="kpi-change">+8.0% рост</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Динамика роста</div>
                    <div class="kpi-value">8.0%</div>
                    <div class="kpi-change">Стабильный рост</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Динамика выручки по месяцам 2025</h3>
                <div class="chart-container">
                    <canvas id="revenueChart"></canvas>
                </div>
            </div>
        `;
    }

    generateLogisticsContent() {
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Среднее время доставки</div>
                    <div class="kpi-value">2.1 дн.</div>
                    <div class="kpi-change">Улучшение на 6%</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Логистические расходы</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('logistics'), true)}</div>
                    <div class="kpi-change">8.5% от выручки</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Производительность доставки (${this.currentPeriod})</h3>
                <div class="chart-container">
                    <canvas id="logisticsPerformanceChart"></canvas>
                </div>
            </div>
        `;
    }

    generateAdvertisingContent() {
        const campaigns = this.data.campaigns_by_category[this.currentCategory] || [];
        
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">ROI рекламы</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('advertising', 'roi'), false)}x</div>
                    <div class="kpi-change">+12% рост</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Расходы на рекламу</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('advertising'), true)}</div>
                    <div class="kpi-change">8% от продаж</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">ROAS по кампаниям (${this.currentPeriod})</h3>
                <div class="chart-container">
                    <canvas id="roasChart"></canvas>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Производительность кампаний</h3>
                <div class="chart-container">
                    <canvas id="campaignPerformanceChart"></canvas>
                </div>
            </div>
            ${campaigns.length > 0 ? `
                <div class="detail-section">
                    <h3 class="detail-section-title">Детали кампаний</h3>
                    <div class="campaign-grid">
                        ${campaigns.map(campaign => `
                            <div class="campaign-card">
                                <div class="campaign-name">${campaign.name}</div>
                                <div class="campaign-stats">
                                    <div class="campaign-stat">
                                        <span class="campaign-stat-label">ROAS:</span>
                                        <span class="campaign-stat-value">${campaign.roas}x</span>
                                    </div>
                                    <div class="campaign-stat">
                                        <span class="campaign-stat-label">CTR:</span>
                                        <span class="campaign-stat-value">${campaign.ctr}%</span>
                                    </div>
                                    <div class="campaign-stat">
                                        <span class="campaign-stat-label">Расход:</span>
                                        <span class="campaign-stat-value">${this.formatNumber(campaign.spend, true)}</span>
                                    </div>
                                    <div class="campaign-stat">
                                        <span class="campaign-stat-label">Выручка:</span>
                                        <span class="campaign-stat-value">${this.formatNumber(campaign.revenue, true)}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    generateExpensesContent() {
        return `
            <div class="detail-section">
                <h3 class="detail-section-title">Структура операционных расходов</h3>
                <div class="chart-container">
                    <canvas id="expenseDonutChart"></canvas>
                </div>
            </div>
            <div class="detail-grid">
                <div class="detail-section">
                    <h3 class="detail-section-title">Помесячная динамика расходов</h3>
                    <div class="chart-container">
                        <canvas id="expenseStackedChart"></canvas>
                    </div>
                </div>
                <div class="detail-section">
                    <h3 class="detail-section-title">KPI эффективности</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">21%</div>
                            <div class="stat-label">Доля в выручке</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">-2.1%</div>
                            <div class="stat-label">Изменение</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">105 ₽</div>
                            <div class="stat-label">На заказ</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateTaxesContent() {
        const taxData = this.data.metrics.taxes[this.currentPeriod];
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Общая налоговая нагрузка</div>
                    <div class="kpi-value">18%</div>
                    <div class="kpi-change">+2.5% изменение</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">НДС</div>
                    <div class="kpi-value">${this.formatNumber(taxData.nds, true)}</div>
                    <div class="kpi-change">Основная часть</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Структура налогов</h3>
                <div class="chart-container">
                    <canvas id="taxBreakdownChart"></canvas>
                </div>
            </div>
        `;
    }

    generateROIContent() {
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Текущий ROI</div>
                    <div class="kpi-value">${this.formatNumber(this.getCategoryData('roi_percent') || 13.5, false, true)}</div>
                    <div class="kpi-change">+1.2% рост</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Динамика ROI (${this.currentPeriod})</h3>
                <div class="chart-container">
                    <canvas id="roiTrendChart"></canvas>
                </div>
            </div>
        `;
    }

    generateOrdersContent() {
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Количество заказов</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('orders', 'all_quantity'))}</div>
                    <div class="kpi-change">За ${this.currentPeriod === 'Year' ? 'янв-окт 2025' : this.currentPeriod}</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Средний чек</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('orders', 'avg_order_value'), true)}</div>
                    <div class="kpi-change">Стабильный</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Анализ заказов</h3>
                <div class="chart-container">
                    <canvas id="ordersAnalysisChart"></canvas>
                </div>
            </div>
        `;
    }

    generateStorageContent() {
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Складские расходы</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('storage'), true)}</div>
                    <div class="kpi-change">+3.2% изменение</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Количество складов</div>
                    <div class="kpi-value">${this.getMetricData('storage', 'warehouse_count')}</div>
                    <div class="kpi-change">Активных</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Эффективность складов</h3>
                <div class="chart-container">
                    <canvas id="storageEfficiencyChart"></canvas>
                </div>
            </div>
        `;
    }

    generateCostOfSalesContent() {
        return `
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-title">Себестоимость</div>
                    <div class="kpi-value">${this.formatNumber(this.getMetricData('cost_of_sales'), true)}</div>
                    <div class="kpi-change">-1.8% оптимизация</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-title">Доля в выручке</div>
                    <div class="kpi-value">51%</div>
                    <div class="kpi-change">Контролируется</div>
                </div>
            </div>
            <div class="detail-section">
                <h3 class="detail-section-title">Анализ себестоимости (янв-окт 2025)</h3>
                <div class="chart-container">
                    <canvas id="costAnalysisChart"></canvas>
                </div>
            </div>
        `;
    }

    generateFunnelContent() {
        const funnelData = this.getFunnelData();
        const aggregatedStages = {};
        
        if (this.currentCategory === 'all') {
            funnelData.forEach(category => {
                category.stages.forEach((stage, index) => {
                    if (!aggregatedStages[stage.name]) {
                        aggregatedStages[stage.name] = 0;
                    }
                    aggregatedStages[stage.name] += stage.value;
                });
            });
        } else {
            const categoryData = funnelData.find(item => item.category === this.currentCategory);
            if (categoryData) {
                categoryData.stages.forEach(stage => {
                    aggregatedStages[stage.name] = stage.value;
                });
            }
        }

        const stages = Object.entries(aggregatedStages);

        return `
            <div class="detail-section">
                <h3 class="detail-section-title">Интерактивная воронка конверсии</h3>
                <div class="funnel-chart-container">
                    ${stages.map((stage, index) => {
                        const [name, value] = stage;
                        const percentage = index === 0 ? 100 : ((value / stages[0][1]) * 100);
                        return `
                            <div class="funnel-stage-block funnel-stage-${index + 1}">
                                <div class="funnel-stage-content">
                                    <div class="funnel-stage-info">
                                        <div class="funnel-stage-title">${name}</div>
                                        <div class="funnel-stage-subtitle">${percentage.toFixed(1)}% от начального</div>
                                    </div>
                                    <div class="funnel-stage-number">${this.formatNumber(value)}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    initializeDetailCharts(metricKey) {
        // Clear existing charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};

        switch (metricKey) {
            case 'realization':
                this.initRevenueCharts();
                break;
            case 'logistics':
                this.initLogisticsCharts();
                break;
            case 'advertising':
                this.initAdvertisingCharts();
                break;
            case 'taxes':
                this.initTaxesCharts();
                break;
            case 'roi':
                this.initROICharts();
                break;
            case 'orders':
                this.initOrdersCharts();
                break;
            case 'operational_expenses':
                this.initExpensesCharts();
                break;
            case 'storage':
                this.initStorageCharts();
                break;
            case 'cost_of_sales':
            case 'cost_of_sales_analysis':
                this.initCostOfSalesCharts();
                break;
        }
    }

    initRevenueCharts() {
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            const monthlyData = this.getMonthlyTrendData();
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: this.data.period_info.months_2025,
                    datasets: [{
                        label: 'Выручка',
                        data: monthlyData,
                        borderColor: '#6639BA',
                        backgroundColor: 'rgba(102, 57, 186, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                }
            });
        }
    }

    initLogisticsCharts() {
        const logisticsCtx = document.getElementById('logisticsPerformanceChart');
        if (logisticsCtx) {
            let chartData, chartLabels;
            
            if (this.currentPeriod === 'Year') {
                chartLabels = this.data.period_info.months_2025;
                chartData = [2.3, 2.2, 2.1, 2.0, 2.1, 2.2, 2.0, 2.1, 2.0, 2.1];
            } else if (this.currentPeriod === 'Month') {
                chartLabels = ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'];
                chartData = [2.2, 2.1, 2.0, 2.1];
            } else {
                chartLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                chartData = [2.1, 2.0, 2.2, 2.1, 2.0, 2.3, 2.2];
            }

            this.charts.logistics = new Chart(logisticsCtx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Время доставки (дни)',
                        data: chartData,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                }
            });
        }
    }

    initAdvertisingCharts() {
        // FIXED: Changed to line charts with connected points as requested
        const roasCtx = document.getElementById('roasChart');
        if (roasCtx) {
            const campaigns = this.data.campaigns_by_category[this.currentCategory] || this.data.campaigns_by_category.Beauty || [];
            
            this.charts.roas = new Chart(roasCtx, {
                type: 'line',
                data: {
                    labels: campaigns.map(c => c.name.replace('Кампания ', '')),
                    datasets: [{
                        label: 'ROAS',
                        data: campaigns.map(c => c.roas),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        const performanceCtx = document.getElementById('campaignPerformanceChart');
        if (performanceCtx) {
            const campaigns = this.data.campaigns_by_category[this.currentCategory] || this.data.campaigns_by_category.Beauty || [];
            
            this.charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: campaigns.map(c => c.name.replace('Кампания ', '')),
                    datasets: [{
                        label: 'Расходы vs Выручка',
                        data: campaigns.map(c => c.revenue / c.spend),
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    initExpensesCharts() {
        const expenseCtx = document.getElementById('expenseDonutChart');
        if (expenseCtx) {
            this.charts.expenses = new Chart(expenseCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Логистика', 'Реклама', 'Склады', 'Операционные', 'Прочее'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: ['#6639BA', '#FF6B35', '#10B981', '#F59E0B', '#8b5cf6']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        const stackedCtx = document.getElementById('expenseStackedChart');
        if (stackedCtx) {
            this.charts.stacked = new Chart(stackedCtx, {
                type: 'bar',
                data: {
                    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн'],
                    datasets: [
                        {
                            label: 'Логистика',
                            data: [8.5, 9.2, 8.8, 9.5, 9.1, 8.9],
                            backgroundColor: '#6639BA'
                        },
                        {
                            label: 'Реклама',
                            data: [6.5, 7.2, 6.8, 7.5, 7.1, 6.9],
                            backgroundColor: '#FF6B35'
                        },
                        {
                            label: 'Склады',
                            data: [2.1, 2.3, 2.2, 2.4, 2.3, 2.2],
                            backgroundColor: '#10B981'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { stacked: true },
                        y: { stacked: true, beginAtZero: true }
                    }
                }
            });
        }
    }

    initTaxesCharts() {
        const taxCtx = document.getElementById('taxBreakdownChart');
        if (taxCtx) {
            const taxData = this.data.metrics.taxes[this.currentPeriod];
            this.charts.taxes = new Chart(taxCtx, {
                type: 'pie',
                data: {
                    labels: ['НДС', 'Налог на прибыль'],
                    datasets: [{
                        data: [taxData.nds, taxData.income_tax],
                        backgroundColor: ['#6639BA', '#FF6B35']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    }

    initROICharts() {
        const roiTrendCtx = document.getElementById('roiTrendChart');
        if (roiTrendCtx) {
            let chartData, chartLabels;
            
            if (this.currentPeriod === 'Year') {
                chartLabels = this.data.period_info.months_2025;
                chartData = [13.2, 13.4, 13.6, 13.5, 13.7, 13.6, 13.8, 13.5, 13.6, 13.5];
            } else if (this.currentPeriod === 'Month') {
                chartLabels = ['Нед 1', 'Нед 2', 'Нед 3', 'Нед 4'];
                chartData = [13.4, 13.5, 13.6, 13.5];
            } else {
                chartLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
                chartData = [13.5, 13.4, 13.6, 13.5, 13.7, 13.6, 13.5];
            }

            this.charts.roiTrend = new Chart(roiTrendCtx, {
                type: 'line',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'ROI %',
                        data: chartData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    initOrdersCharts() {
        const ordersCtx = document.getElementById('ordersAnalysisChart');
        if (ordersCtx) {
            this.charts.orders = new Chart(ordersCtx, {
                type: 'bar',
                data: {
                    labels: ['Заказы', 'Средний чек', 'Выкуп'],
                    datasets: [{
                        label: 'Показатели',
                        data: [this.getMetricData('orders', 'all_quantity'), this.getMetricData('orders', 'avg_order_value'), this.getMetricData('orders', 'all_quantity') * 0.88],
                        backgroundColor: this.data.chart_colors.slice(0, 3)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    initStorageCharts() {
        const storageCtx = document.getElementById('storageEfficiencyChart');
        if (storageCtx) {
            this.charts.storage = new Chart(storageCtx, {
                type: 'bar',
                data: {
                    labels: ['Склад 1', 'Склад 2', 'Склад 3', 'Склад 4', 'Склад 5', 'Склад 6'],
                    datasets: [{
                        label: 'Эффективность %',
                        data: [85, 92, 78, 88, 94, 81],
                        backgroundColor: this.data.chart_colors.slice(0, 6)
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    initCostOfSalesCharts() {
        const costCtx = document.getElementById('costAnalysisChart');
        if (costCtx) {
            this.charts.cost = new Chart(costCtx, {
                type: 'line',
                data: {
                    labels: this.data.period_info.months_2025,
                    datasets: [{
                        label: 'Себестоимость',
                        data: this.getMonthlyTrendData().map(val => val * 0.51),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: false } }
                }
            });
        }
    }

    getMonthlyTrendData() {
        if (this.currentCategory === 'all') {
            // Return aggregated data for all categories
            return [15000000, 16000000, 16500000, 17000000, 18000000, 17500000, 18500000, 19000000, 19500000, 20000000];
        } else {
            return this.data.monthly_trends[this.currentCategory] || [1000000, 1100000, 1200000, 1300000, 1400000, 1350000, 1450000, 1500000, 1550000, 1600000];
        }
    }

    closeModal() {
        document.getElementById('detailModal').classList.add('hidden');
        
        // Cleanup charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Initialize the dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnalyticsDashboard();
});