const inspectionService = require('../services/inspectionService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const imageToBase64 = require('image-to-base64');
require('dotenv').config();

var storage = multer.diskStorage({  //저장 방식
    destination: (req, file, callBack) => { //저장 위치
        callBack(null, 'images/before/')
    },
    filename: (req, file, callBack) => {    //저장 파일명
        const ext = path.extname(file.originalname);
        callBack(null, path.basename(file.originalname, ext) + '-' + Date.now() + ext)  //`${Date.now()}-${file.originalname}`
    }
})

const fileFilter = (req, file, callBack) => {   //확장자 필터링
    // const typeArray = file.mimetype.split('/');
    // const fileType = typeArray[1];

    if (file.mimetype.lastIndexOf('image') > -1) {
        req.fileValidationError = null;
        callBack(null, true);
    }
    else {
        req.fileValidationError = 'error';
        callBack(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
}).single('filename');

async function decodeImage(string) {
    const decodedImage = {}
    decodedImage.data = new Buffer.from(string, 'base64');
    return decodedImage;
}

async function encodeImage(path) {
    imageToBase64(path) //인코딩
        .then(
            (response) => {
                // const output = Date.now() + "output.txt"
                // fs.writeFileSync(output, response);
                // res.download(output);
                return response;
            }
        )
        .catch(
            (error) => {
                console.log(error);
                throw error;
            }
        )
}

const inspectionController = {
    test: async (req, res) => {
        // const content = 'Hello World';
        // fs.writeFile('images/after/test.txt', content, err => {
        //     if (err) { }
        //     return res.send(content)
        // })

        // fs.readFile('images/after/test.txt', 'utf8', (err, data) => {
        //     if (err) { }
        //     return res.send(data)
        // })
    },

    toFlask: async (req, res, next) => {
        upload(req, res, err => {
            if (!req.file) return res.status(400).send('IMAGE_EMPTY');
            if (req.fileValidationError == 'error') return res.status(400).send('IMAGE_UPLOAD_ERROR');

            const filename = `images/before/${req.file.filename}`;
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filename));

            axios({
                method: 'post',
                url: process.env.FLASK_SERVER,
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary()
                },
                data: formData
            }).then(response => {
                req.modelData = response.data;
                next();
            })
        })
    },

    toAndroid: async (req, res) => {
        const memberId = req.memberId;  //tester_id
        const imageStr = req.modelData['img'];
        const resultType = req.modelData['type'];   //'불량품' '정상품'
        const defectedType = req.modelData['name'];   //불량유형 defected_type
        const partName = req.modelData['part'];
        let isDefected, isFixed;    //is_defected, is_fixed

        if (!imageStr) return res.status(400).send('IMAGE_EMPTY');

        if (resultType == '불량품') {
            isDefected = 1;
            isFixed = 0;
        } else {
            isDefected = 0;
            isFixed = null;
        }

        //이미지 디코딩 후 저장
        const imageBuffer = await decodeImage(imageStr);
        const newFileName = `images/after/${Date.now()}.jpg`;
        fs.writeFile(newFileName, imageBuffer.data, err => { })

        try {
            const partId = await inspectionService.findPart(partName);  //part_id            

            const insertData = {
                testerId: memberId,
                partId: partId,
                isDefected: isDefected,
                defectedType: defectedType,
                isFixed: isFixed,
                image: newFileName
            }

            const inspection = await inspectionService.createInspection(insertData);

            const testId = inspection.dataValues.test_id;
            const inspectionDetails = await inspectionService.retrieveInspectionDetails(testId);

            inspectionDetails.imageStr = imageStr;

            return res.send(inspectionDetails);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    },

    getList: async (req, res) => {
        const memberId = req.memberId;
        const memberType = req.memberType;  //사용자0 담당자1
        const part = req.query.part;
        const result = req.query.result;
        const pageInfo = req.query.page;
        const page = parseInt(pageInfo);

        if (!pageInfo) return res.status(400).send('PAGE_EMPTY');

        if (!part && !result) sort = 'all';
        else if (!result) sort = 'part';
        else if (!part) sort = 'result'
        else sort = 'both';

        const data = {
            testerId: memberId,
            part: part,
            result: result,
            page: page
        }

        try {
            let inspectionList;
            if (memberType == 0) inspectionList = await inspectionService.retrieveInspectionList(data, sort);
            else if (memberType == 1) inspectionList = await inspectionService.retrieveDefectedList(data, sort);

            return res.send(inspectionList);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    },

    getListById: async (req, res) => {
        const testId = req.params.testId;

        const inspectionDetails = await inspectionService.retrieveInspectionDetails(testId);
        const filePath = inspectionDetails.result.image;

        imageToBase64(filePath) //인코딩
            .then(
                (response) => {
                    inspectionDetails.imageStr = response;
                    return res.send(inspectionDetails);
                }
            )
            .catch(
                (error) => {
                    console.log(error);
                    return res.status(400).send('IMAGE_ENCODING_ERROR');
                }
            )
    }
}

module.exports = inspectionController;