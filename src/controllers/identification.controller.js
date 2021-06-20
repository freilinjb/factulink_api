const identification = require("../models/identification.model");
const helper = require("../helpers");

exports.getIdentification = (req, res) => {
  try {
    identification.getIdentification((err, results) => {
      if (err) {
        console.log("error: ", err);
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
    console.error('Error: ', error);
    return res.status(500).json({
      error: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
};

exports.addUnid = async (req, res) => {
  try {
    const idUsuario = helper.getUserByToken(req.headers["authorization"]);

    const data = req.body;
    data.creado_por = idUsuario;

    unid.addUnid(data, (error, results) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: "Se ha registrado de forma correcta!",
        status: 200,
      });
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
};
exports.updateUnid = async (req, res) => {
  try {
    // const idUsuario = helper.getUserByToken(req.headers['authorization']);

    const data = req.body;
    data.idUnidad = req.params.idUnidad;
    console.log("data: ", data);
    unid.updateUnid(data, (error, results) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: "Se ha actualizado de forma correcta!",
        status: 200,
      });
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
};

exports.deleteUnid = async (req, res) => {
  try {
    // const idUsuario = helper.getUserByToken(req.headers['authorization']);

    const idUnidad = req.params.idUnidad;
    unid.deleteUnid(idUnidad, (error, results) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        msg: "Se ha eliminado de forma correcta!",
        status: 200,
      });
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      return: 1,
      success: 0,
      msg: "Ah ocurrido un error interno",
    });
  }
};