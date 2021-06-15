const unid = require("../models/unid.model");
const helper = require("../helpers");

exports.getUnid = (req, res) => {
  console.log('Data: prueba');
  let idUnidad = null;
  let data = {};

  idUnidad = req.params.idUnidad ? req.params.idUnidad : null;
  //const prueba = req.query.prueba;
  console.log("req: prueba: ", req.query.page);
  data.idUnidad = idUnidad;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log("data: ", data);
  if (!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page - 1) * data.limit;
  unid.getUnid(data, (err, results, total_page, total_rows) => {
    if (err) {
      console.log("error: ", err);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if (data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page: Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    }

    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
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