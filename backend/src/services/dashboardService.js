const dashboardRepository = require('../repositories/dashboardRepository');

const getSummary = async (userId) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfNextMonth = new Date(startOfMonth);
    startOfNextMonth.setMonth(startOfMonth.getMonth() + 1);

    const [totalBalance, monthStats, transactionCount] = await Promise.all([
        dashboardRepository.getTotalBalance(userId),
        dashboardRepository.getPeriodStats(userId, startOfMonth, startOfNextMonth),
        dashboardRepository.getTransactionCount(userId, startOfMonth, startOfNextMonth)
    ]);

    return {
        totalBalance,
        monthlyIncome: monthStats.income,
        monthlyExpense: monthStats.expense,
        monthlyBalance: monthStats.income - monthStats.expense,
        transactionCount: transactionCount
    };
}

module.exports = {getSummary};