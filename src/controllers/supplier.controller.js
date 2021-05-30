const supplier = require("../models/supplier.model");

exports.getSupplier = (req, res) => {
  let idProveedor = req.body.idProveedor ? req.body.idProveedor : null;
  let data = {};

  data.idProveedor = idProveedor;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  //Si no pasa, le asigna por defecto 20
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page - 1) * data.limit;

  supplier.getSupplier(data, (err, results, total_page, total_rows) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    /**
     * COMPRUEBA SI SOLICITO EL PAGINADOR, ME ENVIA LOS CAMPOS PAGINADOS
     */
    if(data.page){ 
      console.log('total_page: ', total_page);
      return res.status(200).json({
        success: 1,
        data: {
          total_page: Math.ceil(total_page),
          page_cout: results.length,
          page_page: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        }
      });
    }

    return res.status(200).json({
      success: 1,
      data: results,
    });
  });
};

exports.getSupplierByID = (req, res) => {
  console.log('prueba');
  let idProveedor = req.params.idProveedor;

  supplier.getSupplierByID(idProveedor, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    return res.status(200).json({
      success: 1,
       data: results,
    });
  })

}
