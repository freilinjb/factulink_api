const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const product = require('../controllers/product.controller');



router.get(
    "/product/category",
    checkToken,
    product.getCategory
);

router.get(
    "/product/subcategory",
    checkToken,
    product.getSubCategory
);

router.get(
    "/product/brand",
    checkToken,
    product.getBrand
);

router.get(
    "/product/presentationUnid",
    checkToken,
    product.getPresentationUnid
)

router.post(
    "/product",
    checkToken,
    product.registerProduct
)


router.get(
    "/product/:idProducto",
    checkToken,
    product.getProduct
);

router.get(
    "/product",
    checkToken,
    product.getProduct
);


module.exports = router;
