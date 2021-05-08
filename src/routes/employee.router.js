const router = require('express').Router();

const { checkToken } = require('../auth/token_validation');
const employee = require('../controllers/employee.controller');

router.get(
    "/employee",
    checkToken,
    employee.getEmployees);

router.get(
    "/employee/:id",
    checkToken,
    employee.getEmployee
);

router.post(
    "/employee",
    checkToken,
    employee.registerEmployee
);

module.exports = router;
