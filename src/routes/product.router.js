const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");
const { upload } = require("../helpers");

const validar = require('../middlewares/validate');
const product = require("../controllers/product.controller");

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
    upload.single("productImag"),
    validar.registerProduct,
  (req, res, next) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('error: ', errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.registerProduct(req, res, next);
  },
]);

router.put("/product", [
  checkToken,
    upload.single("productImag"),
    validar.updateProduct,
  (req, res, next) => {
    
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
