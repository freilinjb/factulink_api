const comprobante = require("../models/comprobante.model");

exports.getComprobantes = (req, res) => {
  try {
    let tipoComprobante = 1;
    comprobante.getComprobantes(tipoComprobante, (error, results) => {
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
  } catch (error) {
    return res.status(500).json({
      error: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
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