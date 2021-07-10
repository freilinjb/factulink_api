const billing = require("../models/billing.model");

exports.savebilling = (req, res) => {
  const data = req.body;
  console.log('Data: ', data);
  
  billing.savebilling(data, (err, results) => {
      if (err) {
        return res.status(500).json({
          error: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      const numFactura = results.insertId;
      billing.getInvoice(numFactura, (err, results) => {
        if(err) {

          return res.status(200).json({
            error: 0,
            msg: "Ah ocurrido un error"
          });
        }

        return res.status(200).json({
          success: 1,
          data: results
        });
      })
      // return res.status(200).json({
      //   success: 1,
      //    data: results,
      // });
  })
}

exports.getInvoiceByNumber = async (req, res) => {
  let numFactura = req.params.numFactura;
  billing.getInvoice(numFactura, (err, result) => {
    if(err) {
      console.log('Error: ', err);
      return res.status(500).json({
        return: 1,
        error: 1,
        msg: "Ah ocurrido un error interno",
      });
    }

      return res.status(200).json({
        success: 1,
        data: result
      });
  })
}