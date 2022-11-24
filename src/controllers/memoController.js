const db = require("../../models");
const Memo = db.memo;
const Test = db.test;

const resData = {
    result: "default"
}

const AddNewMemo = async (req, res) => {
    resData.result = "result : check input condition"
    if (!req.body.content) return res.status(400).send(resData)
    if (!req.body.test_id) return res.status(400).send(resData)

    const memberId = req.memberId;

    let info = {
        content: req.body.content,
        writer_id: memberId,
        test_id: req.body.test_id
    };
    try {
        const str = req.body.content;
        var memocheck = /^[0-9a-zA-Z~!@#$%^&*()_+|<>?:{}ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{1,50}$/;
        if (!memocheck.test(str)) {
            resData.result = "result : check input condition"
            return res.status(400).send(resData);
        }

        const memo = await Memo.create(info)

        const test = await Test.findOne({
            where: {
                test_id: req.body.test_id
            },
            raw: true
        })

        if (!test) {
            resData.result = "result : test not found"
            return res.status(400).send(resData);
        }

        await Test.update({ memo_id: memo.memo_id }, { where: { test_id: test.test_id } })

        resData.result = "result : memo added"
        return res.send(resData);
    } catch (err) {
        console.log(err);
        return res.status(400).send(resData);
    }
};

const updateMemo = async (req, res) => { //test_id 가 넘어옴 test_id memoindex 찾아서 memo update 
    resData.result = "result : check input condition"
    if (!req.params.test_id) return res.status(400).send(resData)
    if (!req.body.content) return res.status(400).send(resData)

    try {
        const content = req.body.content
        var memocheck = /^[0-9a-zA-Z~!@#$%^&*()_+|<>?:{}ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{1,50}$/;

        if (!memocheck.test(content)) {
            resData.result = "result : check input condition"
            return res.status(400).send(resData);
        }

        const testfind = await Test.findOne({
            where: {
                test_id: req.params.test_id
            },
            raw: true
        })

        if (!testfind) {
            resData.result = "result : test doesn't exist"
            return res.status(400).send(resData);
        }

        await Memo.update({ content: content }, { where: { memo_id: testfind.memo_id } })

        resData.result = "result : memo updated"
        return res.send(resData);
    } catch (err) {
        console.log(err);
        return res.status(400).send(resData);
    }
}

const deleteMemo = async (req, res) => {
    resData.result = "result : check input condition"
    if (!req.params.test_id) return res.status(400).send(resData);

    try {
        const testfind = await Test.findOne({
            where: {
                test_id: req.params.test_id
            },
            raw: true
        })

        if (!testfind) {
            resData.result = "result : test doesn't exist"
            return res.status(400).send(resData);
        }

        await Test.update({ memo_id: null }, { where: { test_id: testfind.test_id } })

        await Memo.destroy({
            where: {
                memo_id: testfind.memo_id
            },
            raw: true
        })

        resData.result = "result : memo deleted"
        return res.send(resData);
    } catch (err) {
        console.log(err);
        return res.status(400).send(resData);
    }
};

module.exports = {
    AddNewMemo,
    updateMemo,
    deleteMemo
}