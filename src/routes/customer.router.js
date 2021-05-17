const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const customer = require('../controllers/customer.controller');

router.get(
    "/customer",
    checkToken,
    customer.getCustomer
);

router.get(
    "/customer/:idCliente",
    checkToken,
    customer.getCustomer
);

router.post(
    "/customer",
    checkToken,
    customer.saveCustomer
);

router.put(
    "/customer",
    checkToken,
    customer.updateCustomer
);


module.exports = router;