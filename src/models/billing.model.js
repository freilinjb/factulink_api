const { connection } = require("../config/database");

exports.savebilling = async (data, callback) => {
  try {
    let numFactura = 0;
    connection.beginTransaction((error) => {
        if (error) {
          return connection.rollback(() => {
            throw error;
          });
        }
  
      connection.query(`INSERT INTO factura(idUsuario, idCliente, idTipoFactura, NFC, descuento, observacion)
      VALUES(?,?,?,getNFC(getTipoComprobante(?)),?,?)`,
      [
        data.idUsuario,
        data.idCliente,
        data.idTipoFactura,
        data.idCliente, //La funcion verifica el tipo de comprobante
        data.descuento,
        data.observacion
      ],
      (error, result, fields) => {
        if (error) {
          return connection.rollback(() => {
              console.log('Error2: ', error);
              return error;
          });

        }
        numFactura = result.insertId;

        connection.query(`UPDATE adquisicion_comprobante ac SET ac.secuencia = (ac.secuencia)+1 WHERE ac.tipoComprobante = getTipoComprobante(?) AND ac.estado IS TRUE`,
        [data.idCliente],
        (error, resultAdquisicion, fields) => {
          if(error) {
            console.log('Error: UPDATE: ', error);
            return error;
          }
        });

        data.productos.forEach((producto, index) => {
          const { idProducto, precio, cantidad, itbis } = producto;
          const numFactura = result.insertId;
          console.log(`INSERT ${result.insertId} added`);

          connection.query(
            `INSERT INTO detalle_factura(numFactura, idProducto, precio, cantidad, itbis) VALUES(?,?,?,?,?)`,
            [numFactura, idProducto, precio, cantidad, itbis],
            (error, rs, fields) => {
              if (error) {
                console.log('Error: ', error);
                return connection.rollback(() => {
                    return callback(error);
                });
              }

              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    return callback(error); 
                  });
                }
              });
            }
          );

          /**
           * ACTUALIZAR EL STOCK DE LOS PRODUCTOS
           */
            
            connection.query(
              `UPDATE producto p SET p.stockInicial = p.stockInicial - ? WHERE p.idProducto = ?`,
              [
                Number(cantidad), 
                Number(idProducto)
              ],
              (error, rs, fields) => {
                if (error) {
                  console.log('Error: ', error);
                  return connection.rollback(() => {
                      return callback(error);
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      return callback(error); 
                    });
                  }
                });
              }
            );

          /**
           * FIN DE LA ACTUALIZACION
           */
        });

        connection.commit((err) => {
          if(err) {
            return connection.rollback(() => {
              return callback(err);
            })
          }
        })
        return callback(null, result); 
      })
    })
  } catch (error) {
    console.log('errorPrueba2 : ', error);
    return "Ha ocurrido un error";
  }
}

exports.getInvoice = async (numFactura, callback) => {

  connection.query(`
  SELECT 
    f.numFactura, 
    t.descripcion AS tipoFactura,
    f.NFC, 
    f.fecha, 
    t.descripcion AS tipo, 
    c.idCliente, 
    c.diasCredito, 
    rs.nombre, 
    rs.razonSocial, 
    t1.descripcion AS telefono,
    c2.descripcion AS correo,
    i.descripcion AS identificacion,
    td.direccion,
    p.codigo, 
    p.nombre AS producto,
    df.precio, 
    df.cantidad,
    df.itbis,
    (df.precio * df.cantidad) * 1.18 AS importe,
    c1.descripcion AS categoria,
    m.descripcion AS marca,
    s.descripcion AS subCategoria,
    u.descripcion AS unidad,
    f.observacion 
  FROM factura f
    INNER JOIN detalle_factura df ON f.numFactura = df.numFactura
    INNER JOIN cliente c ON f.idCliente = c.idCliente
    LEFT JOIN tercero_correo tc ON tc.idTercero = c.idTercero
    LEFT JOIN correo c2 ON tc.idCorreo = c2.idCorreo
    INNER JOIN identificacion i ON i.idTercero = c.idTercero
    LEFT JOIN tercero_telefono tt ON tt.idTercero = c.idTercero
    LEFT JOIN telefono t1 ON tt.idTelefono = t1.idTelefono
    INNER JOIN razon_social rs ON rs.idTercero = c.idTercero

    INNER JOIN tercero_direccion td ON td.idTercero = c.idTercero
    INNER JOIN direccion d ON td.idDireccion = d.idDireccion

    INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
    INNER JOIN producto p ON df.idProducto = p.idProducto
    INNER JOIN categoria c1 ON p.idCategoria = c1.idCategoria
    INNER JOIN subcategoria s ON s.idSubCategoria = p.idSubCategoria
    INNER JOIN marca m ON p.idMarca = m.idMarca
    INNER JOIN unidad u ON p.idUnidad = u.idUnidad
  WHERE f.numFactura = ?`,
    [numFactura],
    (error, fac, fields) => {
      console.log('FacturaFac:numFactura ', numFactura);
      factura = fac;
      console.log('ErrorFactura: ', error);
      return error ? callback(error) : callback(null, fac);
    });
}

exports.getCustomer = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";

    condicion = data.idCliente ? `WHERE a.idCliente = ${data.idCliente}` : "";
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
       if(error) {
        console.error("error: ", error);
        return callback(error);
       }

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
                      i.idTipoIdentificacion,
                      t.descripcion AS tipoIdentificacion,
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
                    INNER JOIN tipo t ON i.idTipoIdentificacion = t.idTipo
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

            return error  ? callback(error)  : callback(null, results, total_page, total_rows);
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
    console.log('saveCustomer: ', data);
    connection.query(
      `CALL registrarCliente (NULL, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.nombre,
        data.urlFoto,
        Number(data.idTipoIdentificacion),
        data.identificacion,
        Number(data.tipoComprobante),
        Number(data.idVendedor),
        data.correo,
        data.telefono,
        Number(data.diasCredito),
        Number(data.limiteCredito),
        Number(data.aplicaDescuento),
        0, //Descuento
        Number(data.idProvincia),
        Number(data.idCiudad),
        data.direccion,
        data.observacion,
        Number(data.creado_por),
        Number(data.estado),
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
    console.log('Model: ', data);
    connection.query(
      `CALL registrarCliente (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        data.idCliente,
        data.nombre,
        data.urlFoto,
        Number(data.idTipoIdentificacion),
        data.identificacion,
        Number(data.tipoComprobante),
        Number(data.idVendedor),
        data.correo,
        data.telefono,
        Number(data.diasCredito),
        Number(data.limiteCredito),
        Number(data.aplicaDescuento),
        0, //Descuento
        Number(data.idProvincia),
        Number(data.idCiudad),
        data.direccion,
        data.observacion,
        Number(data.creado_por),
        Number(data.estado),
      ],
      (error, result, fields) => {
          return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
};
