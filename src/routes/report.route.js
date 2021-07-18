const router = require("express").Router();

const report = require('../controllers/report.controller');
const { checkToken } = require("../auth/token_validation");

router.get(
  "/report/invoice",
  checkToken,
  report.getInvoice
)

router.get(
  "/report/cuentaPorCobrar",
  checkToken,
  report.getClientesCuentasPorCobrar
)
  router.get(
    "/report/invoice/:numFactura",
    checkToken,
    report.getInvoiceByNumber
);

router.get(
  "/report/invoice_current",
  checkToken,
  report.getInvoiceCurrent
);
module.exports = router;