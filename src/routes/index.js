const router = require('express').Router();

const auth = require('./auth.router');
const user = require('./user.router');
const product = require('./product.router');
const supplier = require('./supplier.router');
const customer = require('./customer.router');
const city = require('./city.router');
const province = require('./province.router');
const unid = require('./unid.router');
const identification = require('./identification.router');
const comprobante = require('./comprobante.route');
const billing = require('./billing.route');

router.use(auth);
router.use(user);
router.use(unid);
router.use(product);
router.use(supplier);
router.use(customer);
router.use(city);
router.use(province);
router.use(identification);
router.use(comprobante);
router.use(billing);


module.exports = router;