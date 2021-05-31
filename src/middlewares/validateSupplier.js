const { body, validationResult } = require("express-validator");

exports.validateAddSupplier = [
    body("nombre")
    .notEmpty()
    .withMessage({
      message: "El nombre del producto es obligatorio",
      errorCode: 1,
    }),
    body("razonSocial")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    }),
    body("rnc")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("idProvincia")
    .notEmpty()
    .withMessage({
      message: "El campo del Stock Inicial es oblogatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("idCiudad")
    .notEmpty()
    .withMessage({
      message: "El campo del Stock Minimo es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("direccion")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    }),
    body("estado")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    })];