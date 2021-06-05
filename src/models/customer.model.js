const { connection } = require("../config/database");

exports.getCustomer = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";

    condicion = data.idCliente
      ? `WHERE a.idCliente = ${data.idCliente}`
      : "";
    if (data.idCliente == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE concat(a.nombre,a.razonSocial, a.RNC, a.diasCredito, a.limiteCredito, a.correo, a.telefono) LIKE '%${data.search}%' `;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(c.idCliente) AS cantidad FROM cliente_v c ${search}`,
      [],
      async (error, results, fields) => {
       // total_page = results[0].cantidad;
       if(results.length > 0) {
         console.log('prueba: ', results);
        total_rows = results[0].cantidad;
       } else {
        total_rows = 0;
        console.log('length: ', results);

       }
        console.log('cantidad total: ', total_rows);
        connection.query(
          `SELECT * FROM (
            SELECT c.idCliente,
                      rs.nombre, 
                      rs.razonSocial,
                      u.urlFoto,
                      i.descripcion AS RNC,
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
                    ci.idCiudad,
                    ci.descripcion AS ciudad,
                    p.idProvincia,
                    p.descripcion AS provincia,
                    td.direccion,
                    c.observacion,
                    CASE WHEN c.estado IS TRUE THEN TRUE ELSE FALSE END AS estado
                     FROM cliente c
                    INNER JOIN identificacion i ON i.idTercero = c.idTercero
                    INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
                    INNER JOIN tercero_direccion td ON td.idTercero = c.idTercero
                    INNER JOIN direccion d ON d.idDireccion = td.idDireccion
                    INNER JOIN ciudad ci ON ci.idCiudad = d.idCiudad
                    INNER JOIN provincia p ON p.idProvincia = d.idProvincia
                    LEFT JOIN urlfoto u ON u.idTercero = c.idTercero
            ) AS a
              ${search}  ${condicion}
          `,
          [],
          (error, results, fields) => {
            console.log('idProduct: ', Math.ceil(total_rows / data.limit));
            
            total_page = data.idCliente == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error
              ? callback(error)
              : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );

    console.log("cantidad: ", total_page);
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.saveCustomer = async (data, callback) => {
  try {
    connection.query(
      `CALL registrarCliente (NULL, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.nombre,
        data.razonSocial,
        data.urlFoto,
        data.idTipoIdentificacion,
        data.identificacion,
        data.tipoComprobante,
        data.idVendedor,
        data.correo,
        data.telefono,
        data.diasCredito,
        data.limiteCredito,
        data.aplicaDescuento,
        data.descuento,
        data.idProvincia,
        data.idCiudad,
        data.direccion,
        data.observacion,
        data.creado_por,
        data.estado,
      ],
      (error, result, fields) => {
        return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.updateCustomer = async (data, callback) => {
  try {
    connection.query(
      `CALL registrarCliente (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.idCliente,
        data.nombre,
        data.razonSocial,
        data.urlFoto,
        data.idTipoIdentificacion,
        data.identificacion,
        data.tipoComprobante,
        data.idVendedor,
        data.correo,
        data.telefono,
        data.diasCredito,
        data.limiteCredito,
        data.aplicaDescuento,
        data.descuento,
        data.idProvincia,
        data.idCiudad,
        data.direccion,
        data.observacion,
        data.creado_por,
        data.estado,
      ],
      (error, result, fields) => {
        return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
};
