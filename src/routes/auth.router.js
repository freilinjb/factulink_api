const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { verify } = require("jsonwebtoken");
const { compareSync, hashSync, genSaltSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const { checkToken } = require("../auth/token_validation");


const auth = require('../controllers/auth.controller');

router.post(
    "/auth",
    body("usuario").notEmpty().withMessage({
        message: "El nombre de usuario es obligatorio",
        errorCode: 1,
    }),
    body("clave").trim().isLength({min: 3}).withMessage({
        message: "La contraseña requiere una longitud minima de 3",
        errorCode: 1
    }).notEmpty().withMessage("Debe espesificar la contraseña"),
    (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array([0]["msg"])});
        }
        auth.auth(req, res, next);
    }
);

router.get("/auth", checkToken, auth.verificarToken);



module.exports = router;