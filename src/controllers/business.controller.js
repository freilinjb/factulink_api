const bussiness = require("../models/bussiness.model");

/**
 *@author Freilin Jose Jerez
 *@description Guardar el Datos de la empresa
 * @param {json} req 
 * @param {json} res 
 */
exports.saveEmpresa = async (req, res) => {
  try {
    const data = req.body;
    console.log('Data: ', data);
    // return;
    bussiness.saveEmpresa(data, (error, result) => {
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

exports.getEmpresa = async (req, res) => {
  bussiness.getEmpresa((err, results) => {
    if (err) {
      console.log('getEmpresa: ', err);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }
    
    return res.status(200).json({
      success: 1,
      data: results
    });
  });
}