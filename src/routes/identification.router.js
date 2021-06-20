const router = require("express").Router();
const { validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");

const {
  validateAddUnid,
  validateUpdateUnid,
} = require("../middlewares/validateUnid");
const identification = require("../controllers/identification.controller");

/**
 * ENDPOINT CATEGORIAS START
 */
router.get("/identification", checkToken, identification.getIdentification);

module.exports = router;
