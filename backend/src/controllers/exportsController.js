const pdfService = require('../services/pdfService');
const csvService = require('../services/csvService');

const exportPDF = async (req, res) => {
    try {
        const userId = req.user.userId;
        const filters = req.query;

        const doc = await pdfService.generateTransactionPDF(userId, filters);

        const filename = `transactions_${new Date().toISOString().slice(0, 10)}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);
    } catch (error) {
        console.error('PDF export error: ', error);
        res.status(500).json({error: 'Ошибка генерации PDF'});
    }
};

const exportCSV = async (req, res) => {
    try {
        const userId = req.user.userId;
        const filters = req.query;

        const csvContent = await csvService.generateTransactionsCSV(userId, filters);

        const filename = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Diposition', `attachment; filename="${filename}"`);

        res.send(csvContent);
    } catch (error) {
        console.error('CSV export error: ', error);
        res.status(500).json({error: 'Ошибка генерации CSV'});
    }
};

module.exports = {
    exportPDF,
    exportCSV
};