const csvRepository = require('../repositories/csvRepository');

const generateTransactionsCSV = async (useImperativeHandle, filters = {}) => {
    try {
        const transactions = await csvRepository.getFilteredTransactionsCSV(useImperativeHandle, filters);

        const headers = ['Тип', 'Категория', 'Сумма', 'Дата', 'Описание'];

        const escapeCsvField = (field) => {
            if (field === null || field === undefined) {
                return ''
            };
            const str = String(field);
            if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = transactions.map(t => {
            const typeLabel = t.type === 'income' ? 'Доход' : 'Расход';
            const amount = new Intl.NumberFormat('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(t.amount);
            const date = new Date(t.transaction_date).toLocaleString('ru-RU');

            return [
                escapeCsvField(typeLabel),
                escapeCsvField(t.category_name || '-'),
                amount,
                escapeCsvField(date),
                escapeCsvField(t.description || '-')
            ].join(';');
        });

        const csvContent = [
            headers.join(';'),
            ...rows
        ].join('\n');

        return '\uFEFF' + csvContent;
    } catch (error) {
        console.error('CSV generate error: ', error);
        throw error;
    }
};

module.exports = {
    generateTransactionsCSV
};