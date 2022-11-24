const db = require("../../models");
const Engineer = db.engineer;

const resData = {
    result: "default"
}

const addnewEngineer = async (req, res) => {
    resData.result = "result : check input condition"
    if (!req.body.name) return res.status(400).send(resData)
    if (!req.body.hp) return res.status(400).send(resData)

    var phoneNumChk = /\d{3}-\d{4}-\d{4}/;
    if (!phoneNumChk.test(req.body.hp)) return res.status(400).send('REGEX_ERROR');

    let info = {
        name: req.body.name,
        hp: req.body.hp,
    };

    await Engineer.create(info).catch((err) => {
        console.log(err)
        return res.status(400).send(resData);
    }
        // resData.result = "result : can't add engineer",
        // res.status(400).send(resData)
    );

    resData.result = "result : added";
    return res.send(resData);
};

const getEngineer = async (req, res) => {  //default : 1 
    resData.result = "result : check input condition"

    const tmp = await Engineer.findOne({
        where: {
            engineer_id: 1
        },
        raw: true
    }).catch((err) => {
        console.log(err)
        resData.result = "result : can't find engineer"
        return res.status(400).send(resData)
    }
    );

    return res.send(tmp);
};

const updateEngineer = async (req, res) => {
    if (!req.body.name) return res.status(400).send(resData)
    if (!req.body.hp) return res.status(400).send(resData)

    var phoneNumChk = /\d{3}-\d{4}-\d{4}/;
    if (!phoneNumChk.test(req.body.hp)) return res.status(400).send('REGEX_ERROR');

    const info = {
        name: req.body.name,
        hp: req.body.hp
    }

    await Engineer.update({ name: info.name, hp: info.hp }, { where: { engineer_id: 1 } })
        .catch((err) => {
            console.log(err)
            return res.status(400).send(resData);
        })

    return res.send(resData);
};

const deleteengineer = async (req, res) => {
    await Engineer.destroy({ where: { engineer_id: 1 } })
        .catch((err) => {
            console.log(err);
            return res.status(400).send(resData);
        });

    resData.result = "result : engineer deleted"
    return res.send(resData);
};

module.exports = {
    addnewEngineer,
    getEngineer,
    updateEngineer,
    deleteengineer,
}