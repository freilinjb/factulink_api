const router = require("express").Router();
const { body, validationResult } = require("express-validator");

const { checkToken } = require("../auth/token_validation");
const user = require("../controllers/user.controller");
const { validateAddUser } = require("../middlewares/validateUser");
router.get("/user", checkToken, user.getEmployees);

router.get("/user/typeUser", checkToken, user.getTypeUser);

router.get("/user/:id", checkToken, user.getEmployee);

router.post("/user", [
  checkToken,
  validateAddUser,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Error: ", errors.array([0]["msg"]));
      return res.status(400).json({ errors: errors.array([0]["msg"]) });
    }
    user.addUser(req, res, next);
  },
]);

module.exports = router;
