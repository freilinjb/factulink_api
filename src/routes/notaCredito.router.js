const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const notaCredito = require('../controllers/notaCredito.controller');


router.get(
    "/nota_credito",
    checkToken,
    notaCredito.getNotaCredito
);

router.post(
    "/nota_credito",
    checkToken,
    notaCredito.registrarNotaCredito
);

router.get(
    "/nota_credito/facturas/:id",
    checkToken,
    notaCredito.getFacturas
);

router.get(
    "/nota_credito/facturas",
    checkToken,
    notaCredito.getFacturas
);






// router.get(
//     "/cxp/:id",
//     checkToken,
//     notaCredito.getnotaCreditoPorProveedor
// );

// router.get(
//     "/cxp_pagos/:id",
//     checkToken,
//     notaCredito.getPagosCXP
// );
// /**
//  * ID
//  */
// router.post(
//     "/pagarFactura/",
//     checkToken,
//     notaCredito.pagarFactura
// );



router.get(
    "/notaCreditoProveedor",
    checkToken,
    notaCredito.getCxPProveedor
);

module.exports = router;