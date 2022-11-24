const db = require("../../models");
const Test = db.test;

const resData = {
    result: "default"
}

const updateTest = async (req, res) => {
    resData.result = "result : check input condition"
    if (!req.params.test_id) return res.status(400).send(resData)

    try {
        const tmp = await Test.findOne({
            where: {
                test_id: req.params.test_id
            },
            raw: true
        })

        if (!tmp) {
            resData.result = "result : test doesn't exist"
            return res.status(400).send(resData)
        } else {
            if (tmp.is_fixed == 0) {
                await Test.update({ is_fixed: 1 }, { where: { test_id: req.params.test_id } })
                resData.result = "result : update complete"
            }
            else if (tmp.is_fixed == 1) {
                await Test.update({ is_fixed: 0 }, { where: { test_id: req.params.test_id } })
                resData.result = "result : update complete"
            }
            else {
                resData.result = "result : invalid is_fixed state"
            }
            return res.send(resData)
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(resData);
    }
}

module.exports = {
    updateTest,
};