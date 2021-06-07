const { body, validationResult } = require("express-validator");
exports.validateAddCategory = [
    body('nombre').notEmpty().withMessage({
        message: 'El nombre de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('estado').notEmpty().withMessage({
        message: 'El estado de la categoria es obligatorio',
        errorCode: 1,
    }),
]

exports.validateUpdateCategory = [
    body('idCategoria').notEmpty().withMessage({
        message: 'El campo de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('nombre').notEmpty().withMessage({
        message: 'El nombre de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('estado').notEmpty().withMessage({
        message: 'El estado de la categoria es obligatorio',
        errorCode: 1,
    }),
]

exports.validateAddSubCategory = [
    body('idCategoria').notEmpty().withMessage({
        message: 'El campo de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('nombre').notEmpty().withMessage({
        message: 'El nombre de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('estado').notEmpty().withMessage({
        message: 'El estado de la categoria es obligatorio',
        errorCode: 1,
    }),
]

exports.validateUpdateSubCategory = [
    body('idCategoria').notEmpty().withMessage({
        message: 'El campo de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('nombre').notEmpty().withMessage({
        message: 'El nombre de la categoria es obligatorio',
        errorCode: 1,
    }),
    body('estado').notEmpty().withMessage({
        message: 'El estado de la categoria es obligatorio',
        errorCode: 1,
    }),
]


