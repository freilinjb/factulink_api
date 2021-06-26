const user = require("../models/user.model");

exports.getEmployees = (req, res) => {
  let idUsuario = null;
  let data = {};

  idUsuario = req.params.idUsuario ? req.params.idUsuario : null;
  console.log("req: prueba: ", req.query.page);
  data.idUsuario = idUsuario;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log("prueba: ", req.params);
  if (!data.limit) {
    data.limit = 20;
  }
  
  data.offset = (data.page - 1) * data.limit;
  user.getEmployees(data, (err, results, total_page, total_rows) => {
    if (err) {
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

exports.getEmployee = (req, res) => {
  const idEmpleado = req.params.id;
  user.getEmployee(idEmpleado, (error, resultado) => {
    if (error) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    return res.status(200).json({
      success: 1,
      data: resultado,
    });
  });
};

exports.getTypeUser = async (req, res) => {
  user.getTypeUser((error, results) => {
    if(error) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      })
    }

    return res.status(200).json({
      success: 1,
      data: results,
    })
  })
}

exports.addUser = async (req, res) => {
  try {
    // console.log("addUser: ", req.body);
    const data = req.body;
    console.log('Data: ', data);
    // const data = JSON.parse(req.body.data);
    user.addUser(data, (error, resultado) => {
      if (error) {
        console.log('error: ', error);
        return res.status(500).json({
          return: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        data: resultado[0],
      });
    });
  } catch (error) {
    console.log('error: ', error);

      res.status(400).send("Ah ocurrido un error interno");
  }
};
