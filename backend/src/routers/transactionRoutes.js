const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const {authenticateToken} = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/', transactionController.getTransactions);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;