const db = require("../../models");
const Part = db.part;

const resData = {
    result: "default"
}

const getallparts = async (req, res) => {
    let part = await Part.findAll({}).catch(
        (err) => {
            console.log(err)
            return res.status(400).send(resData);
        }
    );

    return res.send(part);
};

const updatePart = async (req, res) => {
    resData.result = "result : check input condition"
    if (!req.params.part_id) return res.status(400).send(resData);
    if (!req.body.stock) return res.status(400).send(resData);

    var check = /^[0-9]*$/;
    if (!check.test(req.body.stock)) {
        resData.result = "result : check input condition"
        return res.status(400).send(resData);
    }

    const info = {
        stock: req.body.stock
    }

    try {
        const part = await Part.findOne({
            where: {
                part_id: req.params.part_id
            },
            raw: true
        })

        if (part) {
            await Part.update({ stock: info.stock }, { where: { part_id: req.params.part_id } })
            resData.result = "result : update complete"

        }
        else {
            resData.result = "result : part not found"
        }

        return res.send(resData);
    } catch (err) {
        resData.result = "result : check input condition"
        return res.status(400).send(resData)
    }
};

module.exports = {
    getallparts,
    updatePart
};