const { body, validationResult } = require("express-validator");

exports.validateAddUser = [
  body("nombre").notEmpty().withMessage({
    message: "El nombre es obligatorio",
    errorCode: 1,
  }),
  body("apellido").notEmpty().withMessage({
    message: "El apellido es obligatorio",
    errorCode: 1,
  }),
  body("idSexo")
    .notEmpty()
    .withMessage({
      message: "El sexo es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
  body("idTipoIdentificacion")
    .notEmpty()
    .withMessage({
      message: "El tipo de identificacion es obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
  body("identificacion")
    .notEmpty()
    .withMessage({
      message: "La identificacion es un campo obligatorio",
      errorCode: 1,
    })
    .isNumeric(),
  body("usuario").notEmpty().withMessage({
    message: "El nombre de usuario es obligatorio",
    errorCode: 1,
  }),
  body("clave")
    .notEmpty()
    .withMessage({
      message: "El punto de reorden es obligatorio",
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
  }),
  body("idTipoUsuario").notEmpty().isNumeric().withMessage({
    message: "El campo de la categoria es obligatorio",
    errorCode: 1,
  }).isNumeric(),
];
