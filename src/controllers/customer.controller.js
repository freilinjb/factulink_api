const customer = require("../models/customer.model");

exports.getComprobante = (req, res) => {
  customer.getComprobante((err, results) => {
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
  })
}

exports.getCustomer = (req, res) => {
  let idCliente = null;
  let data = {};

  idCliente = req.params.idCliente ? req.params.idCliente : null;
  //const prueba = req.query.prueba;
  // console.log('req: prueba: ', idCliente);
  data.idCliente = idCliente;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  customer.getCustomer(data, (err, results, total_page, total_rows) => {
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

exports.getCustomerByID = (req, res) => {
  console.log("getCustomerByID");
};

/**
 *@author Freilin Jose Jerez
 *@description Guardar el cliente
 * @param {json} req 
 * @param {json} res 
 */
exports.saveCustomer = async (req, res) => {
  try {
    const data = req.body;
    customer.saveCustomer(data, (error, result) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          return: 1,
          success: 0,
          error: 1,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

/**
 *
 * @param {json} req 
 * @param {json} res 
 */
 exports.updateCustomer = async (req, res) => {
  try {
    const data = req.body;
    // console.log('Data: ', data);

    customer.updateCustomer(data, (error, result) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          return: 1,
          success: 0,
          error: 1,
          msg: "Ah ocurrido un error interno",
        });
      }
      return res.status(200).json({
        success: 1,
        data: result,
      });
    });
  } catch (error) {
    console.log('Error: ', error);
    res.status(500).send(error);
  }
};
