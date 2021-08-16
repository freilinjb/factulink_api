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
const report = require('./report.route');
const business = require('./business.router');
const cuentaPorPagar = require('./cuentaPorPagar.router');
const notaCredito = require('./notaCredito.router');

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
router.use(report);
router.use(business);
router.use(cuentaPorPagar);
router.use(notaCredito);


module.exports = router;