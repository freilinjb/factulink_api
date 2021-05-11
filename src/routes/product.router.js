const router = require('express').Router();
const multer = require('multer');

const { checkToken } = require('../auth/token_validation');
const product = require('../controllers/product.controller');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './src/uploads/img/product');
    },
    filename: function(req, file, cb) {
      cb(null, `${Math.random(0,1).toString().substr(2)}${file.originalname}`);
    }
  });

  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.post("/uploads", upload.single('productImag'), (req, res, next) => {
    try {
        console.log('asdfa');
    } catch (error) {
        console.log(error);
    }

    return res.status(200).json("234");
});

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
