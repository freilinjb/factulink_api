const { body, validationResult } = require("express-validator");

exports.validateAddUnid = [
  body("nombre").notEmpty().withMessage({
    message: "El campo de la categoria es obligatorio",
    errorCode: 1,
  }),
  body('estado').notEmpty().withMessage({
    message: 'El estado de la unidad es obligatorio',
    errorCode: 1,
}),
];

exports.validateUpdateUnid = [
  body('nombre').notEmpty().withMessage({
      message: 'El nombre de la unidad es obligatorio',
      errorCode: 1,
  }),
  body('estado').notEmpty().withMessage({
      message: 'El estado de la categoria es obligatorio',
      errorCode: 1,
  }),
]

