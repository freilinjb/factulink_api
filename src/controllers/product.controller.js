const { getProduct, getCategory, getSubCategory, getBrand, getPresentationUnid, registerProduct, getProductByID } = require("../models/product.model");

exports.getProduct = (req, res) => {
  let idProducto = null;
  idProducto = req.params.idProducto ? req.params.idProducto : null;
  //const prueba = req.query.prueba;
  getProduct(idProducto, (err, results) => {
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

exports.getProductByID = (req, res) => {
  console.log('prueba');
  let idProducto = null;
  idProducto = req.params.idProducto;
  //const prueba = req.query.prueba;
  getProductByID(idProducto, (err, results) => {
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

exports.getCategory = (req, res) => {
  getCategory((error, results) => {
    if (error) {
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

exports.getSubCategory = (req, res) => {
    getSubCategory((error, results) => {
      if (error) {
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

  exports.getBrand = (req, res) => {
    getBrand((error, results) => {
      if (error) {
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

  exports.getPresentationUnid = (req, res) => {
    getPresentationUnid((error, results) => {
      if (error) {
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

  exports.registerProduct = async (req, res) => {
    try {
      console.log("data: ", req.body);
      // const { data } = req.body;
      const data = req.body;
      registerProduct(data, (error, resultado) => {
        if (error) {
          return res.status(500).json({
            return: 1,
            success: 0,
            msg: "Ah ocurrido un error interno",
          });
        }
  
        return res.status(200).json({
          success: 1,
          data: resultado,
        });
      });
    } catch (error) {
        res.status(400).send(error);
    }
  };
  
