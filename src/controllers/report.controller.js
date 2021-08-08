const report = require("../models/report.model");

exports.getInvoiceByNumber = async (req, res) => {
  let numFactura = req.params.numFactura;
  report.getInvoice(numFactura, (err, result) => {
    if(err) {
      console.log('Error: ', err);
      return res.status(500).json({
        return: 1,
        error: 1,
        msg: "Ah ocurrido un error interno",
      });
    }

      return res.status(200).json({
        success: 1,
        data: result
      });
  })
}

exports.getInvoiceCurrent = async (req, res) => {
  let numFactura = null;
  let data = {};
  console.log('Data current:');
  numFactura = req.params.numFactura ? req.params.numFactura : null;
  //const prueba = req.query.prueba;
  // console.log('req: prueba: ', idCliente);
  data.numFactura = numFactura;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  report.getInvoiceCurrent(data, (err, results, total_page, total_rows) => {
    if (err) {
      console.log('getInvoiceCurrent1: ', err);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
};

exports.getInvoice = async (req, res) => {
  let numFactura = null;
  let data = {};
  console.log('Data current:');
  numFactura = req.params.numFactura ? req.params.numFactura : null;


  data.numFactura = numFactura;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;

  data.cliente = req.query.cliente ? Number(req.query.cliente) : null;
  data.tipoFactura = req.query.tipoFactura ? Number(req.query.tipoFactura) : null;

  data.fechaDesde = req.query.fechaDesde ? req.query.fechaDesde : null;
  data.fechaHasta = req.query.fechaHasta ? req.query.fechaHasta : null;
  

  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  report.getInvoice(data, (err, results, total_page, total_rows) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
}

exports.getClientesCuentasPorCobrar = async (req, res) => {
  
  let numFactura = null;
  let data = {};
  console.log('Data current:');
  numFactura = req.params.numFactura ? req.params.numFactura : null;


  data.numFactura = numFactura;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;

  data.cliente = req.query.cliente ? Number(req.query.cliente) : null;
  data.tipoFactura = req.query.tipoFactura ? Number(req.query.tipoFactura) : null;

  data.fechaDesde = req.query.fechaDesde ? req.query.fechaDesde : null;
  data.fechaHasta = req.query.fechaHasta ? req.query.fechaHasta : null;
  

  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  report.getClientesCuentasPorCobrar(data, (err, results, total_page, total_rows) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
}

exports.getFacturasPendientes = async (req, res) => {
  let data = {};
  data.idCliente = req.params.idCliente;
  data.estado = req.query.estado;
  console.log('Estado: ', data);

  report.getFacturasPendientes(data, (err, results) => {
    if(err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno"
      })
    }

    return res.status(200).json({
      success: 1,
      data: results
    })
  })
}

exports.savePagos = async (req, res) => {
  try {
    const data = req.body;
    const idCliente = req.body.idCliente;
    data.idCliente = idCliente;
    const fecha = req.body.fecha;
    let montoTotal = Number(req.body.monto);

    // console.log('data: ', data);
    // return;

    report.getFacturasPendientes(data, (error, results) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          return: 1,
          success: 0,
          error: 1,
          msg: "Ah ocurrido un error interno",
        });
      }
      // console.log('Resultados: ', results);
      let facturas = [];
      let monto = montoTotal;
      let monto2 = 0;
      // console.log('monto2: ', monto2);
      
      results.forEach((key, index) => {
        if(monto > 0 && key.estado == 'pendiente') {
        // console.log('index: ', key);

          // const abonar = montoTotal - key.total
          if(monto >= (Number(key.total) - Number(key.pagado)) ) {
            const valor = key.total - Number(key.pagado).toFixed(2);
            console.log('monto2: ', Number(valor.toFixed(2)));
            console.log('key.pagado: ', Number(key.total.toFixed(2)));
            facturas.push({
              numFactura: Number(key.numFactura),
              fecha: fecha,
              abonar: (key.total - Number(key.pagado).toFixed(2)),
              total: Number(key.total.toFixed(2)),
              estado: 2,
            })
          } else {
            facturas.push({
              numFactura: Number(key.numFactura),
              fecha: fecha,
              abonar: Number(monto.toFixed(2)),
              total: Number(key.total.toFixed(2)),
              estado: 1,
            })
          }
          montoTotal -= Number(key.total.toFixed(2));
          monto = montoTotal;
        }
      })

      // console.log('Facturas afectadas: ', facturas.length);
      // console.log('Facturas abonadas', facturas);
      // return;
      data.facturas = facturas;
      // console.log('Resultados: ', data);
      // return;
      report.savePago(data, (error, result) => {
        if(error) {
          console.log('Error: ', error);
          return res.status(500).json({
            success: 1,
            msg: "Ha ocurrido un error",
          });
        }
        return res.status(200).json({
          success: 1,
          data: result,
        });
      });

      // return res.status(200).json({
      //   success: 1,
      //   data: data,
      // });

    });

    // return;
    // report.saveCustomer(data, (error, result) => {
    //   if (error) {
    //     console.log("Error: ", error);
    //     return res.status(500).json({
    //       return: 1,
    //       success: 0,
    //       error: 1,
    //       msg: "Ah ocurrido un error interno",
    //     });
    //   }

    //   return res.status(200).json({
    //     success: 1,
    //     data: result,
    //   });
    // });
  } catch (error) {
    console.log('Errir: ', error);
    res.status(500).send(error);
  }

  
}

exports.getFacturasPorCliente = async (req, res) => {
  let idCliente = req.params.idCliente;

  report.getFacturasPorCliente(idCliente, (err, results) => {
    if(err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno"
      })
    }

    return res.status(200).json({
      success: 1,
      data: results
    })
  });
}

exports.getPagos = (req, res) => {
  let idPago = null;
  let data = {};

  idPago = req.params.idPago ? req.params.idPago : null;
  //const prueba = req.query.prueba;
  // console.log('req: prueba: ', idCliente);
  data.idPago = idPago;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;
  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  report.getPagos(data, (err, results, total_page, total_rows) => {
    if (err) {
      console.log('error: ', err);
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
};

exports.getPagoPorID = async (req, res) => {
  let idPago = req.params.idPago ? req.params.idPago : null;

  report.getPagoPorID(idPago, (err, results) => {
    if(err) {
      return res.status(500).json({
        error: 1,
        msg: "Ah ocurrido un error",
      });
    }

    return res.status(200).json({
      success: 1,
      data: results
    });
  })
}

exports.getPagoPorIDDocumento = async (req, res) => {
  let idPago = req.params.idPago ? req.params.idPago : null;

  report.getPagoPorIDDocumento(idPago, (err, results) => {
    if(err) {
      return res.status(500).json({
        error: 1,
        msg: "Ah ocurrido un error",
      });
    }

    return res.status(200).json({
      success: 1,
      data: results
    });
  })
}

exports.getPagoPorFactura = async (req, res) => {
  let numFactura = req.params.numFactura ? req.params.numFactura : null;

  report.getPagoPorFactura(numFactura, (err, results) => {
    if(err) {
      return res.status(500).json({
        error: 1,
        msg: "Ah ocurrido un error",
      });
    }

    return res.status(200).json({
      success: 1,
      data: results
    });
  })
}


exports.getCompras = async (req, res) => {
  let numFactura = null;
  let data = {};
  console.log('Data current:');
  numFactura = req.params.numFactura ? req.params.numFactura : null;


  data.numFactura = numFactura;
  data.page = req.query.page;
  data.search = req.query.search;
  data.limit = req.query.limit;

  data.cliente = req.query.cliente ? Number(req.query.cliente) : null;
  data.tipoFactura = req.query.tipoFactura ? Number(req.query.tipoFactura) : null;

  data.fechaDesde = req.query.fechaDesde ? req.query.fechaDesde : null;
  data.fechaHasta = req.query.fechaHasta ? req.query.fechaHasta : null;
  

  console.log('data: ', data);
  if(!data.limit) {
    data.limit = 20;
  }
  data.offset = (data.page -1 ) * data.limit;
  report.getCompras(data, (err, results, total_page, total_rows) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    if(data.page) {
      return res.status(200).json({
        success: 1,
        data: {
          total_page : Math.ceil(total_page),
          page_cout: results.length,
          page_number: Number(data.page),
          total_rows: Number(total_rows),
          results: results,
        },
      });
    } 

    return res.status(200).json({
      success: 1,
      data: results
    });
  });
}

exports.saveCompras = async (req, res) => {
  try {
    const data = req.body;
    data.documento = req.body.documento;
    data.fecha = req.body.fecha;
    data.idProveedor = req.body.idProveedor;
    data.idTipoFactura = req.body.idTipoFactura;
    data.idAlmacen = req.body.idAlmacen;
    data.garantia = req.body.garantia;
    data.diasGarantia = req.body.diasGarantia;
    data.idEstadoCompra = req.body.idEstadoCompra;
    data.productos = req.body.productos;

    // console.log('Datos: ', data);


    report.saveCompras(data, (error, results) => {
      if (error) {
        console.log("Error: ", error);
        return res.status(500).json({
          return: 1,
          success: 0,
          error: 1,
          msg: "Ah ocurrido un error interno",
        });
      }
      return res.status(200).json({
        success: 1,
        data: {
          msg: "Se ha registrado de forma correcta !!",
          status: 200,
          idCompra: results,
        },
      });
    });

  } catch (error) {
    console.log('Errir: ', error);
    res.status(500).send(error);
  }

}