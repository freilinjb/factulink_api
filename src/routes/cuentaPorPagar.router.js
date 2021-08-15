const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const cuentaPorPagar = require('../controllers/cuentaPorPagar.controller');


router.get(
    "/cuentaPorPagar",
    checkToken,
    cuentaPorPagar.getCuentaPorPagar
);


router.get(
    "/cxp/:id",
    checkToken,
    cuentaPorPagar.getCuentaPorPagarPorProveedor
);
/**
 * ID
 */
router.post(
    "/pagarFactura/",
    checkToken,
    cuentaPorPagar.pagarFactura
);



router.get(
    "/cuentaPorPagarProveedor",
    checkToken,
    cuentaPorPagar.getCxPProveedor
);

// router.get(
//     "/customer/comprobante",
//     checkToken,
//     cuentaPorPagar.getComprobante
// );

// router.get(
//     "/customer/:idCliente",
//     checkToken,
//     cuentaPorPagar.getCustomer
// );

// router.post("/customer", [
//     checkToken,
//     upload.single("img"),
//     cuentaPorPagar.saveCustomer
// ]);

// router.put("/customer/:idCliente",
//     checkToken,
//     upload.single("img"),
//     cuentaPorPagar.updateCustomer
// );


module.exports = router;