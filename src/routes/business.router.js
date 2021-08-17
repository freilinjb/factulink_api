const router = require('express').Router();
const { upload } = require("../helpers");

const { checkToken } = require('../auth/token_validation');
const business = require('../controllers/business.controller');

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

router.post("/bussiness/config", 
    checkToken,
    business.saveConfig
    );

router.get("/bussiness/config", [
    checkToken,
    business.getConfiguracion
]);

module.exports = router;