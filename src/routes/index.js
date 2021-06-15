const router = require('express').Router();

const auth = require('./auth.router');
const employee = require('./employee.router');
const product = require('./product.router');
const supplier = require('./supplier.router');
const customer = require('./customer.router');
const city = require('./city.router');
const province = require('./province.router');
const unid = require('./unid.router');

router.use(auth);
router.use(employee);
router.use(unid);

router.use(product);
router.use(supplier);
router.use(customer);
router.use(city);
router.use(province);

module.exports = router;