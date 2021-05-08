const { connection } = require("../config/database");

exports.getEmployees = async (callback) => {
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
            LEFT JOIN tipo tp ON tp.idTipo = u.idTipoUsuario
        `,
      [],
      (error, results, fields) => {
        return error ? callback(error) : callback(null, results);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

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

exports.registerEmployee = async (data, callback) => {
    connection.query(
      "CALL registrarEmpleado (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        data.idProducto,
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
        data.creado_por
      ],
      (error, result, fields) => {
        console.log("error");
        return error ? callback(error) : callback(null, result);
      }
    );
  };

exports.updateProduct = async (data, callback) => {

    console.log('data2: ', data);

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
