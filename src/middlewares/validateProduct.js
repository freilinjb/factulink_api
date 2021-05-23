const { body, validationResult } = require("express-validator");

exports.validateAddProduct = [
    body("nombre")
    .notEmpty()
    .withMessage({
      message: "El nombre del producto es obligatorio",
      errorCode: 1,
    }),
    body("idCategoria")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("idSubCategoria")
    .notEmpty()
    .withMessage({
      message: "El campo de la categoria es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("stockInicial")
    .notEmpty()
    .withMessage({
      message: "El campo del Stock Inicial es oblogatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("stockMinimo")
    .notEmpty()
    .withMessage({
      message: "El campo del Stock Minimo es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("reorden")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("precioVenta")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
    body("precioCompra")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    })
    .isNumeric()
    .withMessage({ message: "Este es un campo numerico", errorCode: 1 }),
    body("idSubCategoria").notEmpty().isNumeric().withMessage({
    message: "El campo de la categoria es obligatorio",
    errorCode: 1,
    })];