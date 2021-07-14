const router = require("express").Router();

const billing = require('../controllers/billing.controller');
const { checkToken } = require("../auth/token_validation");
const { body, validationResult } = require("express-validator");

const { validateFactura } = require("../middlewares/validateFactura");

router.post('/billing', [
    checkToken,
    validateFactura,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("error: ", errors.array([0]["msg"]));
        return res.status(400).json({ errors: errors.array([0]["msg"]) });
      }
      billing.savebilling(req, res, next);
    },
  ]);

  router.put('/comprobante', [
    checkToken,
    validateFactura,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("error: ", errors.array([0]["msg"]));
        return res.status(400).json({ errors: errors.array([0]["msg"]) });
      }
      billing.updateComprobantes(req, res, next);
    },
  ]);

  router.get(
    "/billing/invoice/:numFactura",
    checkToken,
    billing.getInvoiceByNumber
);

router.get(
  "/billing/invoice_current",
  checkToken,
  billing.getInvoiceCurrent
);

router.put(
  "/billing/invoice/:numFactura",
  checkToken,
  billing.anularFactura
);


module.exports = router;