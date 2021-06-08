const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");
const { upload } = require("../helpers");

const validar = require("../middlewares/validate");
const { validateAddProduct } = require("../middlewares/validateProduct");
const { validateAddCategory, validateAddSubCategory, validateUpdateSubCategory } = require("../middlewares/validateCategory");
const product = require("../controllers/product.controller");

router.post("/uploads", upload.single("productImag"), (req, res, next) => {
  try {
    // console.log("asdfa: ", req.body);
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json("234");
});
/**
 * ENDPOINT CATEGORIAS START
 */
router.get("/product/category", checkToken, product.getCategory);
router.get("/product/category/:idCategoria", checkToken, product.getCategory);
router.post("/product/category",  [
  checkToken, 
  validateAddCategory,
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('Error: ', errors.array([0]['msg']));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.addCategory(req, res, next);
  }
]);

router.put("/product/category/:idCategoria",  [
  checkToken, 
  validateAddCategory,
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('Error: ', errors.array([0]['msg']));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.updateCategory(req, res, next);
  }
]);

router.delete("/product/category/:idCategoria",
  checkToken, 
  product.deleteCategory
);
/**
 * ENDPOINT CATEGORIAS END
 */

/**
 * ENDPOINT SUBCATEGORIAS START
 */
router.get("/product/subcategory", checkToken, product.getSubCategory);
router.post("/product/subcategory",  [
  checkToken, 
  validateAddSubCategory,
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('Error: ', errors.array([0]['msg']));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.addSubCategory(req, res, next);
  }
]);
router.put("/product/subcategory/:idSubCategoria",  [
  checkToken, 
  validateUpdateSubCategory,
  (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log('Error: ', errors.array([0]['msg']));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.updateSubCategory(req, res, next);
  }
]);
router.delete("/product/subcategory/:idSubCategoria",
  checkToken, 
  product.deleteSubCategory
);
/**
 * ENDPOINT SUBCATEGORIAS END
 */
router.get("/product/brand", checkToken, product.getBrand);

router.get(
  "/product/presentationUnid",
  checkToken,
  product.getPresentationUnid
);

router.post("/product", [
  checkToken,
  upload.single("productImag"),
  validateAddProduct,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("error: ", errors.array([0]["msg"]));
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
      console.log("error: ", errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    product.updateProduct(req, res, next);
  },
]);

router.get("/product", checkToken, product.getProduct);

router.get("/product/:idProducto", checkToken, product.getProductByID);

module.exports = router;
