const db = require("../config/database");

exports.getUsers = (callback) => {
  db.conection.query(
    `SELECT u.usuario, u.clave FROM usuario u WHERE u.estado IS TRUE`,
    [],
    (error, result, fields) => {
      return error ? callback(error) : callback(null, result);
    }
  );
};

exports.getUser = async (usuario, callback) => {
  console.log("usuario: ", usuario);
  await db.connection.query(
    `SELECT u.idUsuario, u.usuario,CONCAT(p.nombre,' ', p.apellido) AS nombre,u.clave , t.descripcion AS tipo FROM usuario u 
      INNER JOIN empleado e ON e.idEmpleado = u.idEmpleado
      INNER JOIN tipo t ON t.idTipo = u.idTipoUsuario
      INNER JOIN persona p ON p.idPersona = e.idPersona
    WHERE u.estado IS TRUE AND u.usuario = ?`,
    [usuario, usuario],
    (error, results, fields) => {
      return error ? callback(error) : callback(null, results[0]);
    }
  );
};
