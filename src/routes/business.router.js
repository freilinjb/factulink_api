const router = require('express').Router();
const { upload } = require("../helpers");

const { checkToken } = require('../auth/token_validation');
const business = require('../controllers/business.controller');

// router.get(
//     "/customer",
//     checkToken,
//     business.getCustomer
// );

// router.get(
//     "/customer/comprobante",
//     checkToken,
//     business.getComprobante
// );

router.get(
    "/bussiness",
    checkToken,
    business.getEmpresa
);

router.post("/bussiness", [
    checkToken,
    upload.single("img"),
    business.saveEmpresa
]);

module.exports = router;