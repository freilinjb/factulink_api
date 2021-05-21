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
  next();
};

exports.updateProduct = [
  body("idProducto")
.notEmpty()
.withMessage({
  message: "Debe espesificar el codigo del producto",
  errorCode: 1,
}).isNumeric().withMessage("Es un campo numerico"),
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



exports.registerProduct = [
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