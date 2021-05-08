const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const supplier = require('../controllers/supplier.controller');

router.get(
    "/supplier",
    checkToken,
    supplier.getSupplier
);

module.exports = router;
