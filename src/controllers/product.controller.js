const { getProduct, getCategory, getSubCategory, getBrand, getPresentationUnid, registerProduct, getProductByID,
  updateProduct, getSupplierByProduct
 } = require("../models/product.model");

exports.getProduct = (req, res) => {
  let idProducto = null;
  let data = {};

  idProducto = req.params.idProducto ? req.params.idProducto : null;
  //const prueba = req.query.prueba;
  console.log('req: prueba: ', req.query.page);
  data.idProducto = idProducto;
  data.page = req.query.page;
  data.limit = req.query.limit;
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  getProduct(data, (err, results, total_page, total_rows) => {
    if (err) {
      console.log('error: ', err);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
};

exports.getAllProduct = (req, res) => {
  let idProducto = null;
  idProducto = req.params.idProducto ? req.params.idProducto : null;
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

    getSupplierByProduct(idProducto, (err, resultSupplier) => {
      if (err) {
        return res.status(500).json({
          error: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      let resultado = null;
      if(results.length > 0) {
        resultado = results[0];
        if(resultSupplier.length > 0) {
          resultado.proveedores = resultSupplier;
        } else {
           resultado.proveedores = [];
        }
      }
      
      return res.status(200).json({
        success: 1,
         data: resultado,
      });
    })
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
      // console.log("data: ", req.file);
      // const { data } = req.body;
      const data = req.body;
      if(req.file.filename) {
        data.urlFoto = `http://localhost:4000/public/img/product/${req.file.filename}`;
      }

      console.log('dataFoto:', data);
      registerProduct(data, (error, resultado) => {
        if (error) {
          console.log('ERROR: ', error);
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
        console.log('error:', error);
        res.status(400).send(error);
    }
  };
  
  exports.updateProduct = async (req, res) => {
    try {
      const data = req.body;
      console.log('data: ', data);
      if(req.file) {
        data.urlFoto = `http://localhost:4000/public/img/product/${req.file.filename}`;
      }

      updateProduct(data, (error, resultado) => {
        if (error) {
          console.log('ERROR: ', error);
          return res.status(500).json({
            return: 1,
            success: 0,
            msg: error,
          });
        }
  
        return res.status(200).json({
          success: 1,
          data: resultado,
        });
      });
    } catch (error) {
        console.log('error: ', error);
        res.status(400).send(error);
    }
  };
