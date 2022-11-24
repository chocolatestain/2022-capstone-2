const { member, sequelize } = require('../../models');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { now } = require('sequelize/types/utils');
require('dotenv').config();

const authService = {
    getProfile: async (accessToken) => {
        const options = {
            method: 'get',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            json: true,
        };

        try {
            const { data } = await axios(options);
            return data;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    findMember: async (memberEmail) => {
        try {
            const memberResult = await member.findOne({ where: { id: memberEmail } });
            return memberResult;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    issueJwt: async (memberId, memberType) => {
        try {
            const jwtToken = jwt.sign({
                id: memberId,
                type: memberType
            }, process.env.JWT_SECRET, {
                //issuer: '',
            });

            // const jwtOptions = {
            //     //maxAge: process.env.JWT_EXPIRE * 1000,
            //     httpOnly: true,
            //     sameSite: 'none',   //client-server 서로 다른 ip여도 동작
            //     secure: true,   //"
            // };    
            return jwtToken;
        } catch (err) {
            console.log(err);
            return err;
        }
    },

    createMember: async (data) => {
        const memberResult = await member.create({
            id: data.id,
            type: data.type,
            name: data.name,
            emp_num: data.empNum,
            phone_num: data.phoneNum
        }).catch((err) => {
            console.log(err);
            return err;
        })

        return memberResult;
    },

    deleteMember: async (memberId) => {
        const memberResult = await member.update({deleted_at : now()},{where:{member_id:memberId}})
        .catch((err)=>{
            console.log(err)
            return err;
        })
        return memberResult;
    }
}

module.exports = authService;