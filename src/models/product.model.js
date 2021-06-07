const { connection } = require("../config/database");

exports.getProduct = async (data, callback) => {
  try {
    let condicion = '';
    let search = '';

    // console.log(`prueba: ${data.limit}, ${data.offset}`);


    condicion = data.idProducto ? `WHERE p.idProducto = ${data.idProducto}`   : "";
    if (data.idProducto == null && data.limit && data.offset >= 0) {

      //Valida si es una busqueda que se va arelizar
    if(data.search) {

      data.search = data.search.trim();
      search = ` WHERE concat(p.codigo,p.nombre, p.marca, p.categoria, p.subcategoria, p.stockInicial,p.stockMinimo,p.reorden,p.precioVenta, p.precioCompra, p.incluyeItbis,p.creado_por) LIKE '%${data.search}%' `; 
    }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    
    let total_page = 0;
    let total_rows = 0;
    connection.query(
      `SELECT COUNT(p.idProducto) AS cantidad FROM producto_v p ${search}`,
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
          `SELECT 
            p.idProducto,
            p.urlFoto,
            p.codigo,
            p.nombre,
            p.marca,
            p.categoria,
            p.subcategoria,
            p.stockInicial,
            p.stockMinimo,
            p.reorden,
            p.precioVenta,
            p.precioCompra,
            p.observacion,
            p.incluyeItbis,
            p.creado_en,
            p.creado_por,
            p.estado FROM  producto_v p
              ${search}  ${condicion}
          `,
          [],
          (error, results, fields) => {
            console.log('idProduct: ', Math.ceil(total_rows / data.limit));
            
            total_page = data.idProducto == null ? Math.ceil(total_rows / data.limit) : 1;
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

exports.getProductByID = async (idProducto, callback) => {
  try {
    // let condicion = null;
    // console.log('condicion: ', condicion);
    // condicion = idProducto ? `WHERE p.idProducto = ${idProducto}` : "";
    // console.log("condicion: ", condicion);
    connection.query(
      `SELECT p.idProducto,
          COALESCE((SELECT pu.urlFoto FROM producto_urlfoto pu WHERE pu.idProducto = p.idProducto LIMIT 1),NULL) AS urlFoto,
          p.codigo,
          p.nombre,
          COALESCE(m.idMarca,0) AS idMarca,
          COALESCE(m.descripcion,'') AS marca,
          c.idCategoria,
          c.descripcion AS categoria,
          s.idSubCategoria,
          s.descripcion AS subcategoria,
          p.stockInicial,
          p.stockMinimo,
          p.idUnidad,
          un.descripcion AS unidad,
          p.reorden,
          COALESCE((SELECT PV.precio FROM precio_venta pv WHERE pv.idProducto = p.idProducto ORDER BY pv.fecha DESC LIMIT 1),0) AS precioVenta,
          COALESCE((SELECT pc.precio FROM precio_compra pc WHERE pc.idProducto = p.idProducto ORDER BY pc.fecha DESC LIMIT 1),0) AS precioCompra,
          p.descripcion,
          p.observacion,
          CASE WHEN p.itbis IS TRUE THEN 'activo' ELSE 'inactivo' END AS incluyeItbis,
          p.creado_en,
          COALESCE(u.usuario,'-') AS creado_por,
          CASE WHEN p.estado IS TRUE THEN '1' ELSE '0' END AS idEstado,
          CASE WHEN p.estado IS TRUE THEN 'activo' ELSE 'inactivo' END AS estado
      FROM producto p 
          INNER JOIN categoria c ON c.idCategoria = p.idCategoria
          INNER JOIN subcategoria s ON s.idSubCategoria = p.idSubCategoria
          INNER JOIN unidad un ON un.idUnidad = p.idUnidad
          LEFT JOIN marca m ON m.idMarca = p.idMarca
          LEFT JOIN usuario u ON u.idUsuario = p.creado_por
      WHERE p.idProducto = ${idProducto}`,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.error("error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getCategory = async (callback) => {
  try {
    connection.query(
      `
        SELECT c.idCategoria, c.descripcion AS categoria FROM categoria c 
            WHERE c.idCategoria AND c.estado IS TRUE
        `,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error";
  }
};

/**
 * METODOS DE CATEGORIAS START
 */
exports.addCategory = async (data, callback) => {
  try {
    console.log('DataCategory: ', data);
    connection.query(`INSERT INTO categoria(descripcion, creado_por, estado) VALUES(?,?,?)`,
    [
      data.nombre,
      data.creado_por,
      data.estado,
    ],
    (error, result, fields) => {
      console.log('DataResultante: ', result);
      console.log('DataResultante: ', fields);
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}

exports.deleteCategory = async (idCategoria, callback) => {
  try {
    console.log('DataCategory: ', idCategoria);
    connection.query(`DELETE FROM categoria WHERE idCategoria = ?`,
    [idCategoria],
    (error, result, fields) => {
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}

exports.updateCategory = async (data, callback) => {
  try {
    console.log('DataCategory: ', data);
    connection.query(`UPDATE categoria c SET c.descripcion = ?, c.estado = ? WHERE c.idCategoria = ?`,
    [
      data.nombre,
      data.estado,
      data.idCategoria,
    ],
    (error, result, fields) => {
      console.log('DataResultante: ', result);
      console.log('DataResultante: ', fields);
      return error ? callback(error) : callback(null, result);
    });
  } catch (error) {
    console.log('Error: ', error);
    return "Ah ocurrido un error interno";
  }
}

/**
 * METODOS DE CATEGORIAS END
 */

exports.getSubCategory = async (callback) => {
  try {
    connection.query(
      `
        SELECT s.idSubCategoria,s.descripcion AS subcategoria, s.idCategoria FROM subcategoria s 
            WHERE s.idCategoria AND s.estado IS TRUE
        `,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getBrand = async (callback) => {
  try {
    connection.query(
      `SELECT m.idMarca, m.descripcion AS marca FROM marca m WHERE m.estado IS TRUE`,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error";
  }
};

exports.getPresentationUnid = async (callback) => {
  try {
    connection.query(
      `SELECT u.idUnidad, 
        u.descripcion AS unidad, 
        u.creado_por,
        CASE WHEN u.estado IS TRUE THEN 'activo' ELSE 'inactivo' END AS estado
    FROM unidad u`,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error interno";
  }
};

exports.registerProduct = async (data, callback) => {
  try {
    console.log("data: ", data);
    connection.query(
      "CALL registrarProducto (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.codigo,
        data.nombre,
        Number(data.idCategoria),
        Number(data.idSubCategoria),
        Number(data.idMarca),
        Number(data.idUnidad),
        data.descripcion,
        Number(data.stockInicial),
        Number(data.stockMinimo),
        Number(data.reorden),
        data.observacion,
        Number(data.incluyeItbis),
        Number(data.precioVenta),
        Number(data.precioCompra),
        data.urlFoto ? data.urlFoto : '',
        Number(data.creado_por),
        Number(data.estado),
      ],
      (error, result, fields) => {
        if (error) {
          return connection.rollback(() => {
            throw error;
          });
        }

        const idProducto = result[0][0].idProducto;
        console.log("resultado2 : ", idProducto);
        const proveedores = data.idProveedor.split(",");
        proveedores.forEach((key) => {
          console.log(
            `INSERT INTO producto_proveedor(idProducto, idProveedor) VALUES(${idProducto},${key})`
          );
          connection.query(
            "INSERT INTO producto_proveedor(idProducto, idProveedor) VALUES(?,?)",
            [idProducto, key],
            (error, result, fields) => {
              if (error) {
                return connection.rollback(() => {
                  throw error;
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
        });
        return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("error: ", error);
  }
};

exports.updateProduct = async (data, callback) => {
  try {
    // const idProducto = data.idProducto != "" ? data.idProducto : "NULL";
    console.log("updateProduct: ", data);
    connection.query(
      "CALL registrarProducto (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.idProducto,
        data.codigo,
        data.nombre,
        Number(data.idCategoria),
        Number(data.idSubCategoria),
        Number(data.idMarca),
        Number(data.idUnidad),
        data.descripcion,
        Number(data.stockInicial),
        Number(data.stockMinimo),
        Number(data.reorden),
        data.observacion,
        Number(data.incluyeItbis),
        Number(data.precioVenta),
        Number(data.precioCompra),
        data.urlFoto ? data.urlFoto : '',
        Number(data.creado_por),
        Number(data.estado),
      ],
      (error, result, fields) => {
        const idProducto = result[0][0].idProducto;
        // console.log("resultado2 : ", idProducto);
        const proveedores = data.idProveedor.split(',');
        // console.log('proveedoresFor: ', proveedores);
        if(proveedores.length > 0 ) {
          proveedores.forEach((key) => {
            // console.log('ForEach: ', key);

            if(key != '' && key != null) {
              connection.query(
                "INSERT INTO producto_proveedor(idProducto, idProveedor) VALUES(?,?)",
                [idProducto, Number(key)],
                (error, result, fields) => {
                  console.log('registros alterados: ', result);
                  if (error) {
                    return connection.rollback(() => {
                      throw error;
                    });
                  }
                  connection.commit((err) => {
                    if (err) {
                      console.log('errorcommit: ', err);
                      return connection.rollback(() => {
                        return callback(error);
                      });
                    }
                  });
                }
              );
            }
          });
        }
        
        return error ? callback(error) : callback(null, result[0]);
      }
    );
  } catch (error) {
    console.log("error: ", error);
  }
};

exports.getSupplierByProduct = async (idProducto, callback) => {
  try {
    connection.query(
      `SELECT pp.idProveedor AS value, COALESCE(rs.nombre, rs.razonSocial) AS label FROM producto_proveedor pp
        INNER JOIN proveedor p ON p.idProveedor = pp.idProveedor
        INNER JOIN razon_social rs ON rs.idTercero = p.idTercero
        WHERE pp.idProducto = ?`,
      [idProducto],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
    return "Ah ocurrido un error interno";
  }
};
