const dashboardRepository = require('../repositories/dashboardRepository');

const getSummary = async (userId) => {
    const [totalBalance, todayStats, weekStats, monthStats] = await Promise.all([
        dashboardRepository.getTotalBalance(userId),
        dashboardRepository.getTodayStats(userId),
        dashboardRepository.getWeekStats(userId),
        dashboardRepository.getMonthStats(userId)
    ]);

    return {
        totalBalance,

        todayIncome: todayStats.income,
        todayExpense: todayStats.expense,
        todayBalance: todayStats.income - todayStats.expense,
        todayCount: todayStats.count,

        weekIncome: weekStats.income,
        weekExpense: weekStats.expense,
        weekBalance: weekStats.income - weekStats.expense,
        weekCount: weekStats.count,

        monthlyIncome: monthStats.income,
        monthlyExpense: monthStats.expense,
        monthlyBalance: monthStats.income - monthStats.expense,
        monthlyCount: monthStats.count
    };
}

module.exports = {getSummary};