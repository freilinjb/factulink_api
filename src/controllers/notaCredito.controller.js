const supplier = require("../models/supplier.model");
const notaCredito = require("../models/notaCredito.model");
const helper = require('../helpers');

exports.getnotaCreditoPorProveedor = async (req, res) => {
  let idProveedor = req.params.id;
  console.log('Proveedor DE PRUEBA: ', idProveedor)
  // return;
  notaCredito.getnotaCreditoPorProveedor(idProveedor, (err, results) => {
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
  });
}

exports.getNotaCredito = async (req, res) => {

  let numNotaCredito = req.params.id;
  notaCredito.getNotaCredito(numNotaCredito, (err, results) => {
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
  });
}

exports.getFacturas = async (req, res) => {

  const numFactura = req.params.id ? req.params.id : null;
  notaCredito.getFacturas(numFactura, (err, results) => {
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
  });
}


exports.registrarNotaCredito = async (req, res) => {

  const datos = req.body;

  notaCredito.registrarNotaCredito(datos, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 1,
        success: 0,
        msg: "Ah ocurrido un error interno",
      });
    }

    return res.status(200).json({
      success: 1,
      msg: "Se ha registrado de forma correcta!!",
      data: results.insertId,
    });
  });
}

exports.getCxPProveedor = async (req, res) => {
  let idProveedor = req.params.idProveedor;

  notaCredito.getCxPProveedor(idProveedor, (err, results) => {
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
  });

}

exports.getFacturasDetalle = async (req, res) => {
  let numFactura = req.params.id;
  notaCredito.getFacturasDetalle(numFactura, (err, results) => {
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
  });
}