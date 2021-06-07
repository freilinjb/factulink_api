const product = require("../models/product.model");
const helper = require('../helpers');

exports.getProduct = (req, res) => {
  let idProducto = null;
  let data = {};

  idProducto = req.params.idProducto ? req.params.idProducto : null;
  //const prueba = req.query.prueba;
  console.log('req: prueba: ', req.query.page);
  data.idProducto = idProducto;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  product.getProduct(data, (err, results, total_page, total_rows) => {
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
  product.getProduct(idProducto, (err, results) => {
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
  product.getProductByID(idProducto, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    product.getSupplierByProduct(idProducto, (err, resultSupplier) => {
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

/**
 * ENDPOINT CATEGORIAS START
 */
exports.getCategory = (req, res) => {
  product.getCategory((error, results) => {
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


exports.addCategory = async (req, res) => {
  try {
    const idUsuario = helper.getUserByToken(req.headers['authorization']);

    const data = req.body;
    data.creado_por = idUsuario;

    product.addCategory(data, (error, results) => {
      if(error) {
        console.log('Error: ', error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: 'Se ha registrado de forma correcta!',
        status: 200
      });
    });
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
}
exports.updateCategory = async (req, res) => {
  try {
    // const idUsuario = helper.getUserByToken(req.headers['authorization']);

    const data = req.body;
    data.idCategoria = req.params.idCategoria;
    console.log('data: ', data);
    product.updateCategory(data, (error, results) => {
      if(error) {
        console.log('Error: ', error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: 'Se ha actualizado de forma correcta!',
        status: 200
      });
    });
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
}

exports.deleteCategory = async (req, res) => {
  try {
    // const idUsuario = helper.getUserByToken(req.headers['authorization']);

    const idCategoria = req.params.idCategoria;
    product.deleteCategory(idCategoria, (error, results) => {
      if(error) {
        console.log('Error: ', error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: 'Se ha eliminado de forma correcta!',
        status: 200
      });
    });
  } catch (error) {
    console.log('Error: ', error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
}
/**
 * ENDPOINT CATEGORIAS END
 */
exports.getSubCategory = (req, res) => {
  product.getSubCategory((error, results) => {
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
    product.getBrand((error, results) => {
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
    product.getPresentationUnid((error, results) => {
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
      product.registerProduct(data, (error, resultado) => {
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

      product.updateProduct(data, (error, resultado) => {
        if (error) {
          console.log('ERROR: ', error);
          return res.status(500).json({
            error: 1,
            data: {
              msg: "Ah ocurrido un error interno",
            }
          })
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
