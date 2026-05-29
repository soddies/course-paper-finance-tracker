import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import '../assets/styles/analytics.css';
import incomeIcon from '../assets/images/category_icon/income/part-time-job.svg';
import expenseIcon from '../assets/images/category_icon/default/expense.svg';
import bagMoneyIcon from '../assets/images/category_icon/default/bag-with-money.svg';
import analyzeIcon from '../assets/images/dashboard_icon/diagram.svg';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Analytics = () => {
    const [period, setPeriod] = useState('month');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i);

    useEffect(() => {
        fetchAnalytics();
    }, [period, selectedMonth, selectedYear]);

    const fetchAnalytics = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const params = new URLSearchParams({
                period, 
                month: selectedMonth,
                year: selectedYear
            });

            const response = await fetch(`http://localhost:3000/api/analytics?${params}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки аналитики');
            }

            const data = await response.json();
            setAnalyticsData(data);
        } catch (err) {
            console.error('Ошибка загрузки аналитики: ', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) {
            return '0';
        }
        return new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const chartData = {
        labels: analyticsData?.dailyStats.map(d => d.label) || [],
        datasets: [
            {
                label: 'Доходы',
                data: analyticsData?.dailyStats.map(d => d.income) || [],
                backgroundColor: '#bec4c9',
                borderRadius: 4,
                barThickness: 8,
            },
            {
                label: 'Расходы',
                data: analyticsData?.dailyStats.map(d => d.expense) || [],
                backgroundColor: '#3c3d3d',
                borderRadius: 4,
                barThickness: 8,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#11212D',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }

                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB'}).format(context.parsed.y); 
                        }
                        return label;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f0f4f8',
                    drawBorder: false,
                },
                ticks: {
                    color: '#9BA8AB',
                    font: {size: 11},
                    callback: function(value) {
                        return value >= 1000 ? (value / 1000) + ' тыс.' : value;
                    }
                },
                border: { display: false}
            },
            x: {
                grid: {display: false},
                ticks: {
                    color: '#9BA8AB',
                    font: {size: 11},
                    maxTicksLimit: 15,
                    callback: function(value) {
                        return period === 'year' ? ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'][value] : value + 1;
                    }
                },
                border: {display: false}
            },
        },
    };

    if (error) {
        return (
            <div className="analytics-page">
                <Header />
                <div className="analytics-error">
                    <p>{error}</p>
                    <button onClick={fetchAnalytics}>Повторить</button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="analytics-page">
                <Header/>
                <div className="analytics-loading">
                    Загрузка...
                </div>
            </div>
        );
    }

    if (!analyticsData || !analyticsData.dailyStats) {
        return (
            <div className="analytics-page">
                <Header />
                <div className="analytics-empty">
                    <p>Нет данных для отображения</p>
                    <button onClick={fetchAnalytics}>Обновить</button>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-page">
            <Header/>

            <main className="analytics-content">
                <div className="analytics-header">
                    <div>
                        <h1>Аналитика</h1>
                        <p className='analytics-subtitle'>
                            {months[selectedMonth]} {selectedYear}
                        </p>
                    </div>

                    <div className="analytics-filters" style={{opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto'}}>
                        <div className="period-toggle">
                            <button className={`period-btn ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>
                                Месяц
                            </button>
                            <button className={`period-btn ${period === 'year' ? 'active' : ''}`} onClick={() => setPeriod('year')}>
                                Год
                            </button>
                        </div>

                        <select className='year-select' value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} disabled={loading}>
                            {years.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                        <select className='month-select' value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} disabled={loading}>
                            {months.map((monthName, index)=> (
                                <option key={index} value={index}>{monthName}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="stat-card-grid-analyze">
                    <div className="stat-card-analyze">
                        <div className="stat-icon-analyze">
                            <img src={incomeIcon}/>
                        </div>
                        <div className="stat-content-analyze">
                            <div className="stat-label-analyze">Доходы</div>
                            <div className="stat-value-analyze income">+{formatCurrency(analyticsData?.totalIncome) ?? 0} ₽</div>
                            <div className="stat-count-analyze">{analyticsData?.incomeCount ?? 0} операций</div>
                        </div>
                    </div>

                    <div className="stat-card-analyze">
                        <div className="stat-icon-analyze">
                            <img src={expenseIcon}/>
                        </div>
                        <div className="stat-content-analyze">
                            <div className="stat-label-analyze">Расходы</div>
                            <div className="stat-value-analyze expense">-{formatCurrency(analyticsData?.totalExpense) ?? 0} ₽</div>
                            <div className="stat-count-analyze">{analyticsData?.expenseCount ?? 0} операций</div>
                        </div>
                    </div>

                    <div className="stat-card-analyze">
                        <div className="stat-icon-analyze">
                            <img src={bagMoneyIcon}/>
                        </div>
                        <div className="stat-content-analyze">
                            <div className="stat-label-analyze">Итого</div>
                            <div className={`stat-value-analyze ${analyticsData?.balance >= 0 ? 'income' : 'expense'}`}>
                                {analyticsData?.balance >= 0 ? '+' : ''}{formatCurrency(analyticsData?.balance ?? 0)} ₽
                            </div>
                            <div className="stat-count-analyze">
                                {analyticsData.balance >= 0 ? 'Вы накопили' : 'Вы потратили больше'}
                            </div>
                        </div>
                    </div>

                    <div className="stat-card-analyze">
                        <div className="stat-icon-analyze">
                            <img src={analyzeIcon}/>
                        </div>
                        <div className="stat-content-analyze">
                            <div className="stat-label-analyze">Средний доход в день</div>
                            <div className="stat-value-analyze">{formatCurrency(analyticsData?.avgExpensePerDay) ?? 0} ₽</div>
                            <div className="stat-count-analyze">за период</div>
                        </div>
                    </div>
                </div>

                <div className="chart-container">
                    <div className="chart-header">
                        <h3>Динамика доходов и расходов</h3>
                        <div className="chart-legend">
                            <span className="legend-item income">
                                <span className='legend-dot income'></span>
                                Доходы
                            </span>
                            <span className="legend-item expense">
                                <span className='legend-dot expense'></span>
                                Расходы
                            </span>
                        </div>
                    </div>

                    <div style={{height: '300px', width: '100%'}}>
                        <Bar options={chartOptions} data={chartData}/>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;