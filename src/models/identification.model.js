const { connection } = require("../config/database");

exports.getIdentification = async (callback) => {
  try {

    connection.query(
      `SELECT
        t.idTipo,
        t.descripcion AS identificacion
      FROM tipo t
      WHERE t.tipo = 'identificacion'
      AND t.estado IS TRUE`,
      [],
      async (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};