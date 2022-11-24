const memocontroller = require("../controllers/memoController.js");
const memorouter = require("express").Router();
const jwtMiddleware = require('../middlewares/jwtMiddleware');

memorouter.post("/", jwtMiddleware.verifyToken, memocontroller.AddNewMemo);
memorouter.put("/:test_id", jwtMiddleware.verifyToken, memocontroller.updateMemo);
memorouter.delete("/:test_id", jwtMiddleware.verifyToken, memocontroller.deleteMemo);

module.exports = memorouter;