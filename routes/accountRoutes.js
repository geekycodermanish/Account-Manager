const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const auth = require('../middlewares/authMiddleware');

router.post('/accounts', accountController.createAccount);
router.get('/accounts', auth, accountController.getAccounts);
router.get('/accounts/:id', auth, accountController.getAccount);
router.put('/accounts/:id', auth, accountController.updateAccount);
router.delete('/accounts/:id', auth, accountController.deleteAccount);
router.post('/login', accountController.login);

module.exports = router;
