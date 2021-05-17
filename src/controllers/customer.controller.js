const customer = require("../models/customer.model");

exports.getCustomer = (req, res) => {
  let idCliente = null;
  idCliente = req.params.idCliente ? req.params.idCliente : null;

  console.log(`idCliente: ${idCliente}`);
  customer.getCustomer(idCliente, (err, results) => {
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

exports.getCustomerByID = (req, res) => {
  console.log("getCustomerByID");
};

/**
 *
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
    res.status(500).send(error);
  }
};
