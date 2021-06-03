const router = require("express").Router();
const { checkToken } = require("../auth/token_validation");

const province = require("../controllers/province.controller");

router.get("/province", checkToken, province.getProvince);
router.get("/province/:idProvincia", checkToken, province.getProvinceByID);

module.exports = router;