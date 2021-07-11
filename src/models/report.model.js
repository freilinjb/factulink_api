const { connection } = require("../config/database");

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
            SUM((df.precio * df.cantidad) * 1.18) AS total
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


exports.getInvoice = async (data, callback) => {
  try {
    console.log('Pruebas de envio de datos')
    let condicion = "";
    let search = "";
    let limit = "";

    condicion = data.numFactura ? ` WHERE f.numFactura = ${data.numFactura}` : "";
    if (data.numFactura == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      console.log('Validacion sin completar');
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE CONCAT(f.numFactura, t.descripcion, f.NFC, DATE_FORMAT( f.fecha , '%Y-%m-%d %T'), COALESCE(rs.nombre, rs.razonSocial)) LIKE '%${data.search}%' `;
      }
      limit = ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    // condicion = idCliente ? `WHERE c.idCliente = ${idCliente}` : "";
    // console.log("condicion: ", condicion);

    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(f.numFactura) AS cantidad FROM factura_v f ${search}`,
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

       console.log('Condicion: ', condicion);
       console.log('Search: ', limit);
        console.log('cantidad total: ', total_rows);
        connection.query(
          `SELECT 
            f.numFactura,
            t.descripcion AS tipoFactura, 
            f.NFC,
            DATE_FORMAT( f.fecha , '%Y-%m-%d %T') AS fecha, 
            COALESCE(rs.nombre, rs.razonSocial) AS cliente,
            COUNT(df.idProducto) AS cantidadProductom, 
            ROUND(SUM((df.precio * df.cantidad) * 1.18),2) AS total,
            CASE WHEN t.idTipo = 13 THEN 'Pagada' ELSE e.descripcion END AS estado
          FROM factura f
            INNER JOIN detalle_factura df ON f.numFactura = df.numFactura 
            INNER JOIN cliente c ON f.idCliente = c.idCliente
            INNER JOIN razon_social rs ON rs.idTercero = c.idTercero
            INNER JOIN tipo t ON t.idTipo = f.idTipoFactura
            INNER JOIN estado e ON e.idEstado = f.idEstado
            ${search}  ${condicion}
          GROUP BY 1,2,3,4,8 ${limit}
          `,
          [],
          (error, results, fields) => {
            console.log('Error: ', error);
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
}