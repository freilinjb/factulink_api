const comprobante = require("../models/comprobante.model");

exports.getComprobantes = (req, res) => {
  let tipoComprobante = null;
  let data = {};

  tipoComprobante = req.params.tipoComprobante ? req.params.tipoComprobante : null;
  //const prueba = req.query.prueba;
  // console.log('req: prueba: ', tipoComprobante);
  data.tipoComprobante = tipoComprobante;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  comprobante.getComprobantes(data, (err, results, total_page, total_rows) => {
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

exports.saveComprobantes = (req, res) => {
  try {
    const data = req.body;

    comprobante.saveComprobantes(data, (error, results) => {
      if (error) {
          console.log('Error: ', error);
        return res.status(500).json({
          error: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        data: {
            msg : "Se ha registrado de forma correcta",
            status: 200
        },
      });
    });
  } catch (error) {
      console.log('Error: ', error);
    return res.status(500).json({
      error: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
};

exports.updateComprobantes = (req, res) => {
    try {
      const data = req.body;
  
      comprobante.updateComprobantes(data, (error, results) => {
        if (error) {
            console.log('Error: ', error);
          return res.status(500).json({
            error: 1,
            success: 0,
            msg: "Ah ocurrido un error interno",
          });
        }
  
        return res.status(200).json({
          success: 1,
          data: {
              msg : "Se ha actualizado de forma correcta",
              status: 200
          },
        });
      });
    } catch (error) {
        console.log('Error: ', error);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }
  };