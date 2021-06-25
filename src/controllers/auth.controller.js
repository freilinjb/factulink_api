const { compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { verify } = require("jsonwebtoken");

const { getUser } = require("../models/auth.model");

exports.auth = async (req, res, next) => {
  const { body } = req;

  getUser(body.usuario, (err, results) => {
    if (err) {
      console.log("error: ", err);
    }

    if (!results) {
      return res.json({
        success: 0,
        message: "Invalid user or password",
      });
    }

    const result = compareSync(body.clave, results.clave);

    if (result) {
      const jsonToken = sign({ result: results }, "qw1234", {
        expiresIn: "48h",
      });
      const { usuario, nombre, tipo, idUsuario } = results;

      return res.json({
        success: 1,
        message: "authentication successfully",
        token: jsonToken,
        auth: true,
        data: {
          idUsuario,
          usuario,
          nombre,
          tipo,
        },
      });
    } else {
      return res.json({
        success: 0,
        message: "Invalid email or password",
      });
    }
  });
};

exports.verificarToken = async (req, res) => {
  let token = req.headers["authorization"];
  token = token.replace("Bearer ", "");
  const resultado = verify(token, "qw1234").result;

  if (!resultado) {
    return res.status(200).json({
      success: 0,
      message: "Ah ocurrido un error",
    });
  }

  return res.status(200).json({
    success: 1,
    data: resultado,
  });
};
