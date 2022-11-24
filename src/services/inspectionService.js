const pool = require('../../config/mysql');
const inspectionDao = require('../daos/inspectionDao');
const { member, test, sequelize } = require('../../models');

const inspectionService = {
    test: async () => {
    },

    findPart: async (partName) => {
        let partId = 0;
        switch (partName) {
            case '덕트':
                partId = 1;
                break;
            case '선체':
                partId = 2;
                break;
            case '선박배관':
                partId = 3;
                break;
            case '케이블':
                partId = 4;
                break;
            case '보온재':
                partId = 5; 
                break;
            case '검출 실패':
                partId = null;
                break;
        }
        return partId;
    },

    createInspection: async (data) => {
        const testResult = await test.create({
            tester_id: data.testerId,
            part_id: data.partId,
            is_defected: data.isDefected,
            defected_type: data.defectedType,
            is_fixed: data.isFixed,
            image_url: data.image
        }).catch((err) => {
            console.log(err);
            throw err;
        });

        return testResult;
    },

    retrieveInspectionList: async (data, sort) => {
        const pageSize = 10;
        const page = data.page;
        const testerId = data.testerId;

        let start = 0;
        let hasNextPage = true;

        if (page <= 0) page = 1;
        else start = (page - 1) * pageSize;

        try {
            const cnt = await test.count({ where: { tester_id: testerId } });
            if (page > Math.round(cnt / pageSize)) return null;
            if ((page + 1) > Math.round(cnt / pageSize)) hasNextPage = false;

            data.start = start;

            const connection = await pool.getConnection(async (conn) => conn);

            let inspectionList;
            if (sort == 'all') inspectionList = await inspectionDao.selectAllInspection(connection, data);
            else if (sort == 'part') inspectionList = await inspectionDao.selectInspectionSortByPart(connection, data);
            else if (sort == 'result') inspectionList = await inspectionDao.selectInspectionSortByResult(connection, data);
            else if (sort == 'both') inspectionList = await inspectionDao.selectInspectionSortByPartAndResult(connection, data);

            connection.release();

            const resData = {
                result: inspectionList,
                hasNextPage: hasNextPage,
                cnt: cnt
            }

            return resData;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    retrieveInspectionDetails: async (testId) => {
        try {
            const connection = await pool.getConnection(async (conn) => conn);
            const inspectionDetails = await inspectionDao.selectInspectionById(connection, testId);

            connection.release();
            const resData = {
                result: inspectionDetails[0]
            }

            return resData;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    retrieveDefectedList: async (data, sort) => {
        const pageSize = 10;
        const page = data.page;

        let start = 0;
        let hasNextPage = true;

        if (page <= 0) page = 1;
        else start = (page - 1) * pageSize;

        try {
            const cnt = await test.count({ where: { isdefected: 1 } });
            if (page > Math.round(cnt / pageSize)) return null;
            if ((page + 1) > Math.round(cnt / pageSize)) hasNextPage = false;

            data.start = start;

            const connection = await pool.getConnection(async (conn) => conn);

            let inspectionList;
            if (sort == 'all') inspectionList = await inspectionDao.selectAllDefected(connection, data);
            else if (sort == 'part') inspectionList = await inspectionDao.selectDefectedSortByPart(connection, data);
            else if (sort == 'result') inspectionList = await inspectionDao.selectDefectedSortByResult(connection, data);
            else if (sort == 'both') inspectionList = await inspectionDao.selectDefectedSortByPartAndResult(connection, data);

            connection.release();

            const resData = {
                result: inspectionList,
                hasNextPage: hasNextPage,
                cnt: cnt
            }

            return resData;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
}

module.exports = inspectionService;