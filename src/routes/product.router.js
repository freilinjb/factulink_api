const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const multer = require("multer");

const { checkToken } = require("../auth/token_validation");
const { upload } = require("../helpers");

const product = require("../controllers/product.controller");

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, './src/uploads/img/product');
//     },
//     filename: function(req, file, cb) {
//       cb(null, `${Math.random(0,1).toString().substr(2)}${file.originalname}`);
//     }
//   });

//   const fileFilter = (req, file, cb) => {
//     // reject a file
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };

//   const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
//   });

router.post("/uploads", upload.single("productImag"), (req, res, next) => {
  try {
    console.log("asdfa: ", req.body);
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json("234");
});

router.get("/product/category", checkToken, product.getCategory);

router.get("/product/subcategory", checkToken, product.getSubCategory);

router.get("/product/brand", checkToken, product.getBrand);

router.get(
  "/product/presentationUnid",
  checkToken,
  product.getPresentationUnid
);

router.post("/product", [
  checkToken,
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
  }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.registerProduct(req, res, next);
  },
]);

router.put("/product", [
  checkToken,

    upload.single("productImag"),

  (req, res, next) => {
    console.log('req: ', req.file.filename);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('error: ', errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.updateProduct(req, res, next);
  },
]);

router.get("/product", checkToken, product.getProduct);

router.get("/product/:idProducto", checkToken, product.getProductByID);

module.exports = router;
