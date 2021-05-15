const { connection } = require("../config/database");

exports.getProduct = async (idProducto, callback) => {
  try {
    let condicion = null;
    console.log('condicion: ', condicion);
    condicion = idProducto ? `WHERE p.idProducto = ${idProducto}` : "";
    console.log("condicion: ", condicion);

    connection.query(
      `
            SELECT p.idProducto,
                p.codigo,
                p.nombre,
                COALESCE(m.descripcion,'') AS marca,
                c.descripcion AS categoria,
                s.descripcion AS subcategoria,
                p.stockInicial,
                p.stockMinimo,
                p.reorden,
                COALESCE((SELECT PV.precio FROM precio_venta pv WHERE pv.idProducto = p.idProducto ORDER BY pv.fecha DESC LIMIT 1),0) AS precioVenta,
                COALESCE((SELECT pc.precio FROM precio_compra pc WHERE pc.idProducto = p.idProducto ORDER BY pc.fecha DESC LIMIT 1),0) AS precioCompra,
                p.observacion,
                CASE WHEN p.itbis IS TRUE THEN 'TRUE' ELSE 'FALSE' END AS incluyeItbis,
                p.creado_en,
                COALESCE(u.usuario,'-') AS creado_por,
                CASE WHEN p.estado IS TRUE THEN 'activo' ELSE 'inactivo' END AS estado
            FROM producto p 
                INNER JOIN categoria c ON c.idCategoria = p.idCategoria
                INNER JOIN subcategoria s ON s.idSubCategoria = p.idSubCategoria
                LEFT JOIN marca m ON m.idMarca = p.idMarca
                LEFT JOIN usuario u ON u.idUsuario = p.creado_por
            ${condicion}
        `,
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

exports.getProductByID = async (idProducto, callback) => {
  try {
    // let condicion = null;
    // console.log('condicion: ', condicion);
    // condicion = idProducto ? `WHERE p.idProducto = ${idProducto}` : "";
    // console.log("condicion: ", condicion);
    connection.query(
      `SELECT p.idProducto,
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
    const idProducto = data.idProducto != "" ? data.idProducto : "NULL";
    console.log('data: ', data.idProducto);
    connection.query(
      "CALL registrarProducto (NULL,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.codigo,
        data.nombre,
        data.idCategoria,
        data.idSubCategoria,
        data.idMarca,
        data.idUnidad,
        data.descripcion,
        data.stockInicial,
        data.stockMinimo,
        data.reorden,
        data.observacion,
        data.incluyeItbis,
        data.precioVenta,
        data.precioCompra,
        data.idProveedor,
        data.creado_por,
        data.estado,
      ],
      (error, result, fields) => {
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
    console.log('updateProduct: ', data.incluyeItbis);
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
        Number(data.idProveedor),
        Number(data.creado_por),
        Number(data.estado),
      ],
      (error, result, fields) => {
        return error ? callback(error) : callback(null, result[0]);
      }
    );

  } catch (error) {
    console.log("error: ", error);
  }
};



