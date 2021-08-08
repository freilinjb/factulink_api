const router = require("express").Router();

const comprobante = require('../controllers/comprobante.controller');
const { checkToken } = require("../auth/token_validation");
const { body, validationResult } = require("express-validator");

const { validateComprobante } = require("../middlewares/validateComprobante");

router.get('/comprobante', checkToken, comprobante.getComprobantes);
router.get('/comprobante/report/:tipoComprobante', checkToken, comprobante.getComprobasByTipo);
router.get('/comprobante/:id', checkToken, comprobante.getComprobantes);
router.post('/comprobante', [
    checkToken,
    validateComprobante,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("error: ", errors.array([0]["msg"]));
        return res.status(400).json({ errors: errors.array([0]["msg"]) });
      }
      comprobante.saveComprobantes(req, res, next);
    },
  ]);

  router.put('/comprobante', [
    checkToken,
    validateComprobante,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("error: ", errors.array([0]["msg"]));
        return res.status(400).json({ errors: errors.array([0]["msg"]) });
      }
      comprobante.updateComprobantes(req, res, next);
    },
  ]);

module.exports = router;