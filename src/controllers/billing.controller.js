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
      billing.getInvoiceByNumber(numFactura, (err, results) => {
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
  billing.getInvoiceByNumber(numFactura, (err, result) => {
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

exports.getInvoiceCurrent = async (req, res) => {
  let numFactura = null;
  let data = {};
  console.log('Data current:');
  numFactura = req.params.numFactura ? req.params.numFactura : null;
  //const prueba = req.query.prueba;
  // console.log('req: prueba: ', idCliente);
  data.numFactura = numFactura;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  billing.getInvoiceCurrent(data, (err, results, total_page, total_rows) => {
    if (err) {
      console.log('getInvoiceCurrent1: ', err);
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

exports.anularFactura = async (req, res) => {
  let numFactura = req.params.numFactura;

  billing.anularFactura(numFactura, (err, result) => {
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
        msg: "Se ha anulado de forma correcta",
      });
  })
}
