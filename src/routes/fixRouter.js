const fixController = require("../controllers/fixController.js");
const fixRouter = require("express").Router();

fixRouter.put("/:test_id", fixController.updateTest);

module.exports = fixRouter;