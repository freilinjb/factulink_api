const { connection } = require("../config/database");


exports.saveEmpresa = async (data, callback) => {
  try {
    console.log('saveCustomer: ', data);
    connection.query(
      `CALL configurarEmpresa (?,?,?,?,?,?,?,?,?,?)`,
      [
        data.urlFoto,
        data.nombre,
        data.razonSocial,
        data.slogan,
        data.telefono,
        data.correo,
        data.RNC,
        Number(data.idCiudad),
        Number(data.idProvincia),
        data.direccion,
      ],
      (error, result, fields) => {
        return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
};


exports.getEmpresa = async (callback) => {
  try {
    connection.query(
      `SELECT 
          e.idEmpresa,
          rs.nombre,
          rs.razonSocial,
          u.urlFoto,
          i.descripcion AS identificacion,
          e.slogan,
          t1.descripcion AS telefono,
          c.descripcion AS correo,
          c1.idCiudad,
          c1.descripcion AS ciudad,
          p.idProvincia,
          p.descripcion AS provincia,
          td.direccion
        FROM empresa e
          INNER JOIN tercero t ON e.idTercero = t.idTercero
          INNER JOIN tercero_telefono tt ON t.idTercero = tt.idTercero
          INNER JOIN telefono t1 ON tt.idTelefono = t1.idTelefono
          INNER JOIN tercero_correo tc ON t.idTercero = tc.idTercero
          INNER JOIN correo c ON tc.idCorreo = c.idCorreo
          INNER JOIN tercero_direccion td ON td.idTercero = t.idTercero
          INNER JOIN direccion d ON td.idDireccion = d.idDireccion
          INNER JOIN ciudad c1 ON d.idCiudad = c1.idCiudad
          INNER JOIN provincia p ON c1.idProvincia = p.idProvincia
          INNER JOIN razon_social rs ON t.idTercero = rs.idTercero
          INNER JOIN urlfoto u ON u.idTercero = t.idTercero
          INNER JOIN identificacion i ON t.idTercero = i.idTercero
      `,
      [],
      (error, results, fields) => {
        return error  ? callback(error)  : callback(null, results);
      }
    );

  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};
