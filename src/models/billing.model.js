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

        //PRUEBA
        // connection.query(`UPDATE adquisicion_comprobante ac SET ac.secuencia = ac.secuencia+1 WHERE ac.tipoComprobante = (SELECT c.tipoComprobante FROM cliente c WHERE c.idCliente = ?);`,
        // [data.idCliente],
        // (error, resultAdquisicion, fields) => {
        //   if(error) {
        //     console.log('Error: UPDATE: ', error);
        //     return error;
        //   }
        // });
        /*PRUEBA */
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

exports.anularFactura = async (numFactura, callback) => {
  try {
    connection.query(
      `UPDATE factura f SET f.activo = FALSE WHERE f.numFactura = ?`,
      [numFactura],
      (error, resultd, fields) => {
        if(error) {
          return callback(error);
        }

        console.log('Eliminar: ', numFactura);
        connection.query(`
        UPDATE producto p
          INNER JOIN detalle_factura df ON p.idProducto = df.idProducto
          SET p.stockInicial = p.stockInicial+df.cantidad
          WHERE df.numFactura = ?`,
          [numFactura],
          (error, results, fields) => {
            // return error ? callback(error) : callback(null, results);
          })

        return callback(null, resultd);
      }
    )
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
}

exports.getInvoiceByNumber = async (numFactura, callback) => {

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
    f.observacion,
    CASE WHEN f.activo IS TRUE THEN 'Activo' ELSE 'Anulada' END AS estatus
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

exports.getInvoiceCurrent = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";
    let limit = "";

    condicion = data.numFactura ? `f.numFactura = ${data.numFactura}` : "";
    if (data.numFactura == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` AND CONCAT(f.numFactura, t.descripcion, f.NFC, DATE_FORMAT( f.fecha , '%Y-%m-%d %T'), COALESCE(rs.nombre, rs.razonSocial)) LIKE '%${data.search}%' `;
      }
      limit += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(f.numFactura) AS cantidad FROM factura_dia_actual f ${search ? ' WHERE 1 = 1' + search : ''}`,
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
          `SELECT 
            f.numFactura,
            t.descripcion AS tipoFactura, 
            f.NFC,
            DATE_FORMAT( f.fecha , '%Y-%m-%d %T') AS fecha, 
            COALESCE(rs.nombre, rs.razonSocial) AS cliente,
            COUNT(df.idProducto) AS cantidadProductom, 
            SUM((df.precio * df.cantidad) * 1.18) AS total,
            CASE WHEN f.activo IS TRUE THEN 'Activo' ELSE 'Anulada' END AS estatus
          FROM factura f
            INNER JOIN detalle_factura df ON f.numFactura = df.numFactura 
            INNER JOIN cliente c ON f.idCliente = c.idCliente
            INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
            INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
            WHERE DATE(f.fecha) = CURRENT_DATE() ${search}  
            GROUP BY 1,2,3,4 ${limit}
          `,
          [],
          (error, results, fields) => {
            console.log('Datos: ', results);
            // console.log('numFactura: ', Math.ceil(total_rows / data.limit));
            
            total_page = data.numFactura == null ? Math.ceil(total_rows / data.limit) : 1;
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
