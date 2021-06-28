const { body, validationResult } = require("express-validator");

exports.validateComprobante = [
    body("tipoComprobante")
    .notEmpty()
    .withMessage({
      message: "El tipo de comprobante",
      errorCode: 1,
    }),
    body("idSucursal")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("idTipoDocumento")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("vencimiento")
    .notEmpty()
    .withMessage({
      message: "La Fecha de vencimiento es un campo obligatorio",
      errorCode: 1,
    }),
    body("inicio")
    .notEmpty()
    .withMessage({
      message: "El rango de inicio es un campo obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("final")
    .notEmpty()
    .withMessage({
      message: "El rango final es un campo obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("secuencia")
    .notEmpty()
    .withMessage({
      message: "La secuencia es un campo obligatorio",
      errorCode: 1,
    })];