const router = require("express").Router();
const { validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");
const { validateAddSupplier, validateUpdateSupplier } = require("../middlewares/validateSupplier");

const supplier = require("../controllers/supplier.controller");
const { upload } = require("../helpers");

router.get("/supplier", checkToken, supplier.getSupplier);

router.get("/supplier/:idProveedor", checkToken, supplier.getSupplierByID);

router.post('/supplier',[
    checkToken,
    upload.single("img"),
    validateAddSupplier,
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log('Error: ', errors.array([0]['msg']));
            return res.status(400).json({ errors: errors.array([0]["msg"]) });
        }
        supplier.addSupplier(req, res, next);
    }

]);

router.put('/supplier',[
    checkToken,
    upload.single("img"),
    validateUpdateSupplier,
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log('Error: ', errors.array([0]['msg']));
            return res.status(400).json({ errors: errors.array([0]["msg"]) });
        }
        supplier.updateSupplier(req, res, next);
    }

]);

module.exports = router;
