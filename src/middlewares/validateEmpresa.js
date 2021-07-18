const { body, validationResult } = require("express-validator");

exports.validateAddUser = [
  body("nombre").notEmpty().withMessage({
    message: "El nombre es obligatorio",
    errorCode: 1,
  }),
  body("razonSocial").notEmpty().withMessage({
    message: "El apellido es obligatorio",
    errorCode: 1,
  }),
  body("telefono").notEmpty().withMessage({
    message: "El apellido es obligatorio",
    errorCode: 1,
  }),
  body("correo").notEmpty().withMessage({
    message: "El apellido es obligatorio",
    errorCode: 1,
  }),
  body("RNC").notEmpty().withMessage({
    message: "El apellido es obligatorio",
    errorCode: 1,
  }),
  body("idProvincia")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
      errorCode: 1,
    })
    .isNumeric()
    .withMessage({ message: "Este es un campo numerico", errorCode: 1 }),
  body("idCiudad").notEmpty().isNumeric().withMessage({
    message: "El campo de la categoria es obligatorio",
    errorCode: 1,
  }),
  body("direccion").notEmpty().withMessage({
    message: "El campo de la categoria es obligatorio",
    errorCode: 1,
  })
];
