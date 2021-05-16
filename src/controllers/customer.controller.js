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
    console.log('getCustomerByID');
    
}
