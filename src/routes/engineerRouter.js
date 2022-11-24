const engineercontroller = require("../controllers/engineerController.js");
const engineerrouter = require("express").Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');

engineerrouter.post("/", jwtMiddleware.verifyToken, engineercontroller.addnewEngineer);
engineerrouter.get("/", jwtMiddleware.verifyToken, engineercontroller.getEngineer);
engineerrouter.put("/", jwtMiddleware.verifyToken, engineercontroller.updateEngineer);
engineerrouter.delete("/", jwtMiddleware.verifyToken, engineercontroller.deleteengineer);

module.exports = engineerrouter;