const router = require('express').Router();

const auth = require('./auth.router');
const employee = require('./employee.router');
const product = require('./product.router');
const supplier = require('./supplier.router');

router.use(auth);
router.use(employee);
router.use(product);
router.use(supplier);

module.exports = router;