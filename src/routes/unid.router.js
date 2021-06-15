const router = require("express").Router();
const { validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");

const {
  validateAddUnid,
  validateUpdateUnid,
} = require("../middlewares/validateUnid");
const unid = require("../controllers/unid.controller");

/**
 * ENDPOINT CATEGORIAS START
 */
router.get("/product/unid", checkToken, unid.getUnid);
router.get("/product/unid/:idUnidad", checkToken, unid.getUnid);
router.post("/product/unid", [
  checkToken,
  validateAddUnid,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Error: ", errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    unid.addUnid(req, res, next);
  },
]);

router.put("/product/unid/:idUnidad", [
  checkToken,
  validateUpdateUnid,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Error: ", errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    unid.updateUnid(req, res, next);
  },
]);

router.delete("/product/unid/:idUnidad", checkToken, unid.deleteUnid);

module.exports = router;
