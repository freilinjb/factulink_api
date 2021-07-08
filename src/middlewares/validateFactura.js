const { body, validationResult } = require("express-validator");

exports.validateFactura = [
    body("idUsuario")
    .notEmpty()
    .withMessage({
      message: "El tipo de comprobante",
      errorCode: 1,
    }),
    body("idCliente")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("idTipoFactura")
    .notEmpty()
    .withMessage({
      message: "La Fecha de vencimiento es un campo obligatorio",
      errorCode: 1,
    }),
    body("idFormaPago")
    .notEmpty()
    .withMessage({
      message: "El rango de inicio es un campo obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("tipoNFC")
    .notEmpty()
    .withMessage({
      message: "El rango final es un campo obligatorio",
      errorCode: 1,
    })
    .isNumeric()]