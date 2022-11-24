const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspectionController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

//router.get('/test', inspectionController.test);
router.post('/upload', jwtMiddleware.verifyToken, inspectionController.toFlask, inspectionController.toAndroid);
router.get('/list', jwtMiddleware.verifyToken, inspectionController.getList);
router.get('/list/:testId', jwtMiddleware.verifyToken, inspectionController.getListById);

module.exports = router;