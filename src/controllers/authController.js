const authService = require('../services/authService');

const authController = {
    login: async (req, res) => {
        const accessToken = req.headers['authorization'];

        if (!accessToken) return res.status(400).send('KAKAO_TOKEN_EMPTY');

        try {
            const tokenResult = await authService.getProfile(accessToken);
            const memberEmail = tokenResult.kakao_account.email;
            console.log(`accessToken:${accessToken}, memberEmail:${memberEmail}`);
            const memberResult = await authService.findMember(memberEmail);

            if (!memberResult) return res.status(400).send('MEMBER_NOT_EXIST');

            const memberId = memberResult.dataValues.member_id;
            const memberType = memberResult.dataValues.type;
            const memberName = memberResult.dataValues.name;

            const jwtToken = await authService.issueJwt(memberId, memberType);

            if (!jwtToken) return res.status(400).send('JWT_ISSUE_ERROR');

            const resData = {
                id: memberEmail,
                name: memberName,
                type: memberType,
                jwtToken: jwtToken
            }

            return res.send(resData);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    },

    signUp: async (req, res) => {
        const accessToken = req.headers['authorization'];
        const memberType = req.body.type;
        const memberEmpNum = req.body.empNum;
        const memberPhoneNum = req.body.phoneNum;
         if (!accessToken) return res.status(400).send('KAKAO_TOKEN_EMPTY');
         if (!memberEmpNum) return res.status(400).send('MEMBER_EMP_NUM_EMPTY');
         if (!memberPhoneNum) return res.status(400).send('MEMBER_PHONE_NUM_EMPTY');

        var empNumChk = /^[0-9]*$/;
        var phoneNumChk = /\d{3}-\d{4}-\d{4}/;

        if (!empNumChk.test(memberEmpNum)) return res.status(400).send('REGEX_ERROR');
        if (!phoneNumChk.test(memberPhoneNum)) return res.status(400).send('REGEX_ERROR');

        try {
            const tokenResult = await authService.getProfile(accessToken);
            const memberEmail = tokenResult.kakao_account.email;
            const memberName = tokenResult.kakao_account.profile.nickname;

            const data = {
                id: memberEmail,
                name: memberName,
                type: memberType,
                empNum: memberEmpNum,
                phoneNum: memberPhoneNum
            }

            const memberResult = await authService.createMember(data);

            if (!memberResult) return res.status(400).send('MEMBER_CREATE_ERROR');

            const memberId = memberResult.dataValues.member_id;
            const jwtToken = await authService.issueJwt(memberId, memberType);

            if (!jwtToken) return res.status(400).send('JWT_ISSUE_ERROR');

            const resData = {
                id: memberEmail,
                name: memberName,
                type: memberType,
                jwtToken: jwtToken
            }

            return res.send(resData);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    },

    leave: async (req, res) => {
        const memberId = req.memberId;

        try {
            const memberResult = await authService.deleteMember(memberId);

            if (!memberResult) return res.status(400).send('MEMBER_DELETE_ERROR');
            const resData = {
                result: 'success'
            }
            return res.send(resData);
        } catch (err) {
            console.log(err);
            return res.status(400).send('ERROR');
        }
    }
}

module.exports = authController;