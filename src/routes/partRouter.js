const partcontroller = require("../controllers/partController.js");
const partrouter = require("express").Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');

partrouter.get("/getallparts", jwtMiddleware.verifyToken, partcontroller.getallparts);
partrouter.put("/:part_id", jwtMiddleware.verifyToken, partcontroller.updatePart);

module.exports = partrouter;