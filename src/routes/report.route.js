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
  "/report/cuentaPorCobrar/:idCliente",
  checkToken,
  report.getFacturasPendientes
)

router.post(
  "/report/cuentaPorCobrar",
  checkToken,
  report.savePagos
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

router.get(
  "/report/invoiceByClient/:idCliente",
  checkToken,
  report.getFacturasPorCliente
);

router.get(
  "/report/pagos",
  checkToken,
  report.getPagos
);

router.get(
  "/report/pagos/:idPago",
  checkToken,
  report.getPagoPorID
);

router.get(
  "/report/pagos/documento/:idPago",
  checkToken,
  report.getPagoPorIDDocumento
);

router.get(
  "/report/pagos_factura/:numFactura",
  checkToken,
  report.getPagoPorFactura
);

router.get(
  "/report/compras",
  checkToken,
  report.getCompras
);


router.post(
  "/report/compra",
  checkToken,
  report.saveCompras
);

module.exports = router;