const { connection } = require("../config/database");

exports.getEmployees = async (data, callback) => {
  try {
    let condicion = "";
    let search = "";

    condicion = data.idUsuario ? `WHERE idUsuario = ${data.idUsuario}` : "";
    if (data.idUsuario == null && data.limit && data.offset >= 0) {
      //Valida si es una busqueda que se va arelizar
      if (data.search) {
        data.search = data.search.trim();
        search = ` WHERE concat(nombre, sexo, correo, telefono, usuario, tipoUsuario, estado ) LIKE '%${data.search}%' `;
      }
      condicion += ` LIMIT ${data.limit}  OFFSET ${data.offset} `;
    }

    let total_page = 0;
    let total_rows = 0;

    connection.query(
      `SELECT COUNT(v.idUsuario) AS cantidad FROM empleado_v v ${search}`,
      [],
      async (error, results, fields) => {
        // total_page = results[0].cantidad;
        if (results.length > 0) {
          console.log("prueba: ", results);
          total_rows = results[0].cantidad;
        } else {
          total_rows = 0;
          console.log("length: ", results);
        }
        console.log("cantidad total: ", total_rows);
        connection.query(
          `SELECT 
              idUsuario, 
              nombre, 
              sexo, 
              correo, 
              telefono, 
              usuario, 
              tipoUsuario, 
              estado 
            FROM empleado_v
              ${search}  ${condicion}
          `,
          [],
          (error, results, fields) => {
            console.log("idUser: ", Math.ceil(total_rows / data.limit));

            total_page =
              data.idUsuario == null ? Math.ceil(total_rows / data.limit) : 1;
            console.log("total_page: ", total_rows);

            return error
              ? callback(error)
              : callback(null, results, total_page, total_rows);
          }
        );

        return total_page;
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.getTypeUser = async (callback) => {
  try {
    connection.query(`
    SELECT 
      t.idTipo, 
      t.descripcion AS tipoUsuario
    FROM tipo t 
    WHERE t.tipo = 'usuario' AND t.estado IS TRUE`,
    [],
    (error, results, fields) => {
      console.log('Error: ', error);
      return error ? callback(error) : callback(null, results);
    })
  } catch (error) {
    return callback(errro);
  }
}

exports.getEmployee = async (idEmpleado, callback) => {
  try {
    connection.query(
      `
        SELECT
            e.idEmpleado, 
            CONCAT(p.nombre, ' ',p.apellido) AS nombre, 
            s.descripcion AS sexo, 
            c.descripcion AS correo, 
            t.descripcion AS telefono,u.usuario, 
            tp.descripcion AS tipoUsuario,
            CASE WHEN e.estado IS TRUE THEN 'Activo' ELSE 'Inactivo' END AS estado
        FROM empleado e
            INNER JOIN persona p ON p.idPersona = e.idEmpleado
            INNER JOIN sexo s ON s.idSexo = p.idSexo
            INNER JOIN tercero_correo tc ON tc.idTercero = p.idTercero 
            LEFT JOIN correo c ON c.idCorreo = tc.idCorreo
            INNER JOIN tercero_telefono tt ON tt.idTercero = p.idTercero
            INNER JOIN telefono t ON t.idTelefono = tt.idTelefono
            LEFT JOIN usuario u ON u.idEmpleado = e.idEmpleado
            LEFT JOIN tipo tp ON tp.idTipo = u.idTipoUsuario WHERE e.idEmpleado = ?`,
      [idEmpleado],
      (error, result, fields) => {
        return error ? callback(error) : callback(null, result);
      }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
};

exports.getUserByID = async (idUsuario, callback) => {
  connection.query(
    `SELECT u.idUsuario, 
    u.usuario, 
    t2.descripcion AS tipoUsuario,
    p.nombre,
    p.apellido, 
    s.idSexo,
    s.descripcion AS sexo, 
    p.idTipoIdentificacion,
    t4.descripcion AS tipoIdentificacion,
    p.identificacion,
    p.fechaNacimiento,
    t3.descripcion AS telefono,
    c.descripcion AS correo,
    pv.idProvincia,
    pv.descripcion AS provincia,
    ci.idCiudad,
    ci.descripcion AS ciudad,
    td.direccion,
    CASE WHEN u.estado IS TRUE THEN 1 ELSE 0 END estado
    FROM usuario u
   INNER JOIN tipo t2 ON u.idTipoUsuario = t2.idTipo
   INNER JOIN tipo t ON u.idTipoUsuario = t.idTipo
   INNER JOIN empleado e ON u.idEmpleado = e.idEmpleado
   INNER JOIN persona p ON e.idPersona = p.idPersona
   INNER JOIN tipo t4 ON p.idTipoIdentificacion = t4.idTipo
   INNER JOIN sexo s ON p.idSexo = s.idSexo
   INNER JOIN tipo t1 ON p.idTipoIdentificacion = t1.idTipo
   INNER JOIN tercero_telefono tt ON tt.idTercero = p.idTercero
   INNER JOIN telefono t3 ON tt.idTelefono = t3.idTelefono
   INNER JOIN tercero_correo tc ON tc.idTercero = p.idTercero
   INNER JOIN correo c ON tc.idCorreo = c.idCorreo
   INNER JOIN tercero_direccion td ON td.idTercero = p.idTercero
   INNER JOIN direccion d ON td.idDireccion = d.idDireccion
   INNER JOIN provincia pv ON pv.idProvincia = d.idProvincia
   INNER JOIN ciudad ci ON d.idCiudad = ci.idCiudad
   WHERE u.idUsuario = ${idUsuario}`,
  [],
  async (error, results, fields) => {
    return error ? callback(error) : callback(null, results);
  });
}

exports.addUser = async (data, callback) => {
  console.log('Model: ', data)
  connection.query(
    "CALL registrarEmpleado (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      data.nombre,
      data.apellido,
      data.idSexo,
      data.idTipoIdentificacion,
      data.identificacion,
      data.fechaNacimiento,
      data.correo,
      data.telefono,
      data.usuario,
      data.clave,
      data.idProvincia,
      data.idCiudad,
      data.direccion,
      data.idTipoUsuario,
      data.creado_por,
    ],
    (error, result, fields) => {
      console.log("error");
      return error ? callback(error) : callback(null, result);
    }
  );
};

exports.updateProduct = async (data, callback) => {
  console.log("data2: ", data);

  connection.query(
    "CALL registrarProducto (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      data.idProducto,
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
      data.itbis,
      data.PrecioVenta,
      data.PrecioCompra,
      data.idProveedor,
      data.creado_por,
      data.estado,
    ],
    (error, result, fields) => {
      console.log("error");
      return error ? callback(error) : callback(null, result);
    }
  );
};
