const analyticsRepository = require('../repositories/analyticsRepository');

const getAnalytics = async (userId, period, month, year) => {
    const yearNum = parseInt(year) || new Date().getFullYear();
    const monthNum = month !== undefined ? parseInt(month) : new Date().getMonth();

    let startDate, endDate, daysInPeriod;

    if (period === 'month') {
        startDate = new Date(yearNum, monthNum, 1, 0, 0, 0, 0);
        endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);
        daysInPeriod = endDate.getDate();
    } else {
        startDate = new Date(yearNum, 0, 1, 0, 0, 0, 0);
        endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);
        daysInPeriod = 365;
    }

    const [totals, periodRows] = await Promise.all([
        analyticsRepository.getTotals(userId, startDate, endDate),
        analyticsRepository.getPeriodStats(
            userId,
            startDate,
            endDate,
            period === 'month' ? "DAY" : "MONTH"
        )
    ]);

    const limit = period === 'month' ? daysInPeriod : 12;
    const statsArray = Array.from({ length: limit }, (_, i) => ({ 
        label: i + 1, 
        income: 0, 
        expense: 0 
    }));

    periodRows.forEach(row => {
        const idx = parseInt(row.period_unit) - 1;
        if (idx >= 0 && idx < statsArray.length) {
            if (row.type === 'income') {
                statsArray[idx].income = parseFloat(row.amount);
            } else {
                statsArray[idx].expense = parseFloat(row.amount);
            }
        }
    });

    const totalIncome = parseFloat(totals.total_income || 0);
    const totalExpense = parseFloat(totals.total_expense || 0);
    
    return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        incomeCount: parseInt(totals.income_count || 0),
        expenseCount: parseInt(totals.expense_count || 0),
        avgExpensePerDay: daysInPeriod > 0 ? parseFloat((totalExpense / daysInPeriod).toFixed(2)) : 0,
        dailyStats: statsArray
    };
};

module.exports = { getAnalytics };