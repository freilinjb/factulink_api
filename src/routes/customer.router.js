const router = require('express').Router();
const { body, validationResult } = require("express-validator");
const { upload } = require("../helpers");

const { checkToken } = require('../auth/token_validation');
const customer = require('../controllers/customer.controller');

router.get(
    "/customer",
    checkToken,
    customer.getCustomer
);

router.get(
    "/customer/comprobante",
    checkToken,
    customer.getComprobante
);

router.get(
    "/customer/:idCliente",
    checkToken,
    customer.getCustomer
);

router.post("/customer", [
    checkToken,
    upload.single("img"),
    customer.saveCustomer
]);

router.put(
    "/customer/:idCliente",
    checkToken,
    customer.updateCustomer
);


module.exports = router;