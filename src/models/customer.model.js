const { connect } = require('../app');
const { conection, connection } = require('../config/database');

exports.getCustomer = async (idCliente, callback) => {
    try {
        let condicion = null;
        condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
        console.log('condicion: ', condicion);

        connection.query(
            `SELECT c.idCliente,rs.nombre, rs.razonSocial, u.urlFoto,
            COALESCE((
              SELECT t.descripcion AS telefono FROM tercero_telefono tt
                INNER JOIN telefono t ON t.idTelefono = tt.idTelefono
              WHERE tt.idTercero = c.idTercero LIMIT 1
            ),'') AS telefono, 
          COALESCE((
                SELECT co.descripcion AS correo FROM tercero_correo tc
                  INNER JOIN correo co ON co.idCorreo = tc.idCorreo
                WHERE tc.idTercero = c.idTercero LIMIT 1
              ),'') AS correo,
           c.diasCredito,
           c.limiteCredito,
         CASE WHEN c.aplicaDescuento IS TRUE THEN TRUE ELSE FALSE END AS aplicaDescuento,
          c.descuento,
          ci.descripcion AS ciudad,
          p.descripcion AS provincia,
          td.direccion,
          c.observacion,
          CASE WHEN c.estado IS TRUE THEN 'activo' ELSE 'inactivo' END AS estado
           FROM cliente c
          INNER JOIN identificacion i ON i.idTercero = c.idTercero
          INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
          INNER JOIN tercero_direccion td ON td.idTercero = c.idTercero
          INNER JOIN direccion d ON d.idDireccion = td.idDireccion
          INNER JOIN ciudad ci ON ci.idCiudad = d.idCiudad
          INNER JOIN provincia p ON p.idProvincia = d.idProvincia
          LEFT JOIN urlfoto u ON u.idTercero = c.idTercero
          ${condicion}`
        ,
        [],
        (error, results, fields) => {
            return error ? callback(error) : callback(null, results);
        });
    } catch (error) {
        console.log('error: ', error);
        return "Ah ocurrido un error del servidor";
    }
}