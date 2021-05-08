const { getSupplier } = require("../models/supplier.model");

exports.getSupplier = (req, res) => {
  let idProveedor = null;

  idProveedor = req.body.idProveedor ? req.body.idProveedor : null;
  getSupplier(idProveedor, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};
