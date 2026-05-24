const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

const generateTransactionPDF = async (userId, filters = {}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const fontPath = path.join(__dirname, '../../fonts/DejaVuSans.ttf')
            const fontBold = path.join(__dirname, '../../fonts/DejaVuSans-Bold.ttf')
            const fontOblique = path.join(__dirname, '../../fonts/DejaVuSans-Oblique.ttf')

            if (!fs.existsSync(fontPath)) {
                console.warn('Шрифт не найден')
            }

            const doc = new PDFDocument({
                size: 'A4',
                margin: 40,
                info: {
                    Title: 'Отчет по транзакциям',
                    Author: 'Finance Tracker',
                    CreationDate: new Date()
                }
            });

            if (fs.existsSync(fontPath)) {
                doc.font(fontPath);
            }

            const params = [userId];
            let query = `
                select t.id, t.type, t.amount, t.description, t.transaction_date, c.name as category_name
                from transactions t
                left join categories c on t.category_id = c.id
                where t.user_id = $1
            `;
            let paramIndex = 2;

            if (filters.type && filters.type !== 'all') {
                query += ` and t.type = $${paramIndex++}`;
                params.push(filters.type);
            }

            if (filters.categoryId && filters.categoryId !== 'all') {
                query += ` and t.category_id = $${paramIndex++}`;
                params.push(filters.categoryId);
            }

            if (filters.dateFrom) {
                query += ` and t.transaction_date >= $${paramIndex++}`;
                params.push(filters.dateFrom);
            }

            if (filters.dateTo) {
                query += ` and t.transaction_date <= $${paramIndex++}`;
                params.push(filters.dateTo);
            }

            if (filters.sortBy && filters.sortOrder) {
                const allowedSortBy = ['transaction_date', 'amount', 'type'];
                const allowedSortOrder = ['asc', 'desc'];

                if (allowedSortBy.includes(filters.sortBy) && allowedSortOrder.includes(filters.sortOrder)) {
                    query += ` order by t.${filters.sortBy} ${filters.sortOrder.toUpperCase()}`;
                } else {
                    query += ` order by t.transaction_date desc`;
                }
            } else {
                query += ` order by t.transaction_date desc`;
            }

            const result = await pool.query(query, params);
            const transactions = result.rows;

            if (fs.existsSync(fontBold)) {
                doc.font(fontBold);
            }
            doc.fontSize(20).text('Финансовый отчет', { align: 'center' });
            doc.moveDown();

            if (fs.existsSync(fontPath)) {
                doc.font(fontPath);
            }
            doc.fontSize(10).text(
                `Период: ${filters.dateFrom || 'начало'} - ${filters.dateTo || 'текущая дата'}`, 
                { align: 'center' }
            );
            doc.text(`Всего операций: ${transactions.length}`, { align: 'center' });
            doc.moveDown(2);

            if (transactions.length === 0) {
                doc.fontSize(14).font(fontBold);
                doc.text('Транзакции не найдены', {align: 'center'})
                doc.moveDown(2);

                doc.fontSize(12).font(fontPath);
                const message = 'Вы экспортировали пустой список с транзакциями. Зачем?';

                const words = message.split(' ');
                let line = '';
                const lines = [];
                const maxWidth = doc.page.width - 80;

                for (const word of words) {
                    const testLine = line + (line ? ' ' : '') + word;
                    const width = doc.widthOfString(testLine);

                    if (width > maxWidth && line) {
                        lines.push(line);
                        line = word;
                    } else {
                        line = testLine;
                    }
                }

                if (line) {
                    lines.push(line)
                }

                const lineHeight = 20;
                const startY = doc.y;

                lines.forEach((textLine, index) => {
                    doc.text(textLine, 40, startY + (index * lineHeight), {
                        width: doc.page.width - 80,
                        align: 'center'
                    });
                });

                doc.moveDown(3);

                doc.fontSize(10).font(fontOblique);
                doc.text('Рекомендую изменить параметры фильтра или добавить новые транзакции', {
                    align: 'center'
                });
            } else {
                const tableTop = doc.y;
                const tableLeft = 40;
                const colWidth = [60, 130, 80, 120, 90];

                if (fs.existsSync(fontBold)) {
                    doc.font(fontBold);
                }
                doc.fontSize(8);
                doc.text('Тип', tableLeft, tableTop, { width: colWidth[0] });
                doc.text('Категория', tableLeft + colWidth[0], tableTop, { width: colWidth[1], align: 'left' });
                doc.text('Дата', tableLeft + colWidth[0] + colWidth[1], tableTop, { width: colWidth[2] });
                doc.text('Описание', tableLeft + colWidth[0] + colWidth[1] + colWidth[2], tableTop, { width: colWidth[3], align: 'center' });
                doc.text('Сумма', tableLeft + colWidth[0] + colWidth[1] + colWidth[2] + colWidth[3], tableTop, { width: colWidth[4], align: 'right' });

                doc.moveTo(tableLeft, tableTop + 15)
                .lineTo(tableLeft + colWidth.reduce((a, b) => a + b, 0), tableTop + 15)
                .stroke();
                
                doc.moveDown(0.5);

                if (fs.existsSync(fontPath)) {
                    doc.font(fontPath);
                }
                doc.fontSize(8);
                let rowY = tableTop + 25;

                for (const t of transactions) {
                    if (rowY > 650) {
                        doc.addPage();
                        rowY = 30;
                    }

                    const typeLabel = t.type === 'income' ? 'Доход' : 'Расход';
                    const date = new Date(t.transaction_date).toLocaleDateString('ru-RU');
                    const amount = new Intl.NumberFormat('ru-RU', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }).format(t.amount) + ' RUB';

                    doc.text(typeLabel, tableLeft, rowY, { width: colWidth[0] });
                    doc.text(t.category_name || '-', tableLeft + colWidth[0], rowY, { width: colWidth[1], align: 'left' });
                    doc.text(date, tableLeft + colWidth[0] + colWidth[1], rowY, { width: colWidth[2] });
                    doc.text(t.description || '-', tableLeft + colWidth[0] + colWidth[1] + colWidth[2], rowY, { width: colWidth[3], ellipsis: true, align: 'center'});
                    doc.text(amount, tableLeft + colWidth[0] + colWidth[1] + colWidth[2] + colWidth[3], rowY, { width: colWidth[4], align: 'right' });

                    rowY += 18;
                }

                if (rowY > 550) {
                    doc.addPage();
                    rowY = 40;
                } else {
                    doc.moveDown(1);
                }

                const summaryTop = rowY;
                doc.moveTo(tableLeft, summaryTop)
                .lineTo(tableLeft + colWidth.reduce((a, b) => a + b, 0), summaryTop)
                .stroke();
                
                const totalIncome = transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const totalExpense = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const balance = totalIncome - totalExpense;

                const fmt = new Intl.NumberFormat('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });

                let summaryY = summaryTop + 20;
                
                if (fs.existsSync(fontBold)) {
                    doc.font(fontBold);
                }
                doc.fontSize(12);
                
                doc.text(`Итог:`, tableLeft, summaryY);
                
                if (fs.existsSync(fontPath)) {
                    doc.font(fontPath);
                }
                summaryY += 25;
                doc.fontSize(10);
                doc.text(`Доходов: ${fmt.format(totalIncome)} RUB`, tableLeft, summaryY);
                
                summaryY += 20;
                doc.text(`Расходов: ${fmt.format(totalExpense)} RUB`, tableLeft, summaryY);
                
                if (fs.existsSync(fontBold)) {
                    doc.font(fontBold);
                }
                summaryY += 25;
                doc.fillColor(balance >= 0 ? '#06141B' : '#e74c3c');
                doc.text(`Баланс: ${fmt.format(balance)} RUB`, tableLeft, summaryY);
                doc.fillColor('#000000');
            }
            if (fs.existsSync(fontOblique)) {
                doc.font(fontOblique);
            }
            const footerY = doc.page.height - 90;
            doc.fontSize(12);

            const footerContent = `Создано: ${new Date().toLocaleString('ru-RU')}\nПчелкина Екатерина РПО 23/2`;

            doc.text(footerContent, 40, footerY, { 
                width: doc.page.width - 80, 
                align: 'center',
                lineGap: 5
            });

            doc.end();
            resolve(doc);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            reject(error);
        }
    });
};

module.exports = { generateTransactionPDF };