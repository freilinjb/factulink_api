const router = require("express").Router();
const { checkToken } = require("../auth/token_validation");

const city = require("../controllers/city.controller");

router.get("/city", checkToken, city.getCitys);
router.get("/city/:idCiudad", checkToken, city.getCityByID);

module.exports = router;