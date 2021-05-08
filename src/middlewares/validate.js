const { body, validationResult } = require("express-validator");

exports.validarInicioSesion = async (req, res, next) => {
  console.log("prueba2");
  //const { body } = res;
  //console.log('res: [', req.body, "]");
  body("usuario").notEmpty().withMessage({
    message: "Debe espesificar el nombre de usuario",
    errorCode: 1,
  }),
    // password must be at least 5 chars long
    body("username").isEmail(),
    // password must be at least 5 chars long
    body("password").isLength({ min: 5 }),
    (req, res) => {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    };
  //next();

  //console.log("asdasdf: ", body);
  next();

  // return res.status(200).json({mensaje: "asdfasdf"});
};
