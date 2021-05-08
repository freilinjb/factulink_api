const {
  getEmployees,
  getEmployee,
  registerEmployee,
} = require("../models/employee.model");

exports.getEmployees = (req, res) => {
  console.log("prueba: ", req.params);
  getEmployees((err, results) => {
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

exports.getEmployee = (req, res) => {
  const idEmpleado = req.params.id;
  getEmployee(idEmpleado, (error, resultado) => {
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

exports.registerEmployee = async (req, res) => {
  try {
    console.log("data: ", req.body);
    // const { data } = req.body;
    const data = JSON.parse(rq.body.data);
    registerEmployee(data, (error, resultado) => {
      if (error) {
        return res.status(500).json({
          return: 1,
          success: 0,
          msg: "Ah ocurrido un error interno",
        });
      }

      return res.status(200).json({
        success: 1,
        data: resultado,
      });
    });
  } catch (error) {
      res.status(400).send("Invalid JSON string");
  }
};
