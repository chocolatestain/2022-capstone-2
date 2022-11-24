async function test(connection) { }

//검사 내역 추가
async function insertInspection(connection, data) {
    const datas = [data.testerId, data.partId, data.isDefected, data.defectedType, data.isFixed, data.image];
    const query = `
        insert into test(tester_id, part_id, is_defected, defected_type, is_fixed, image_url)
        values(?, ?, ?, ?, ?, ?)`

    const [rows] = await connection.query(query, datas);
    return rows[0];
}

//[사용자] 검사 내역 목록 - 전체
async function selectAllInspection(connection, data) {
    const pageSize = 10;
    const testerId = data.testerId;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where tester_id = ${testerId} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[사용자] 검사 내역 목록 - 부품 별
async function selectInspectionSortByPart(connection, data) {
    const pageSize = 10;
    const testerId = data.testerId;
    const part = data.part;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where tester_id = ${testerId} and test.part_id = ${part} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[사용자] 검사 내역 목록 - 조치 결과 별
async function selectInspectionSortByResult(connection, data) {
    const pageSize = 10;
    const testerId = data.testerId;
    const result = data.result;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where tester_id = ${testerId} and test.is_fixed = ${result} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[사용자] 검사 내역 목록 - 부품 별 / 조치 결과 별
async function selectInspectionSortByPartAndResult(connection, data) {
    const pageSize = 10;
    const testerId = data.testerId;
    const part = data.part;
    const result = data.result;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test
        where tester_id = ${testerId} and test.is_fixed = ${result} and test.part_id = ${part} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[담당자] 검사 내역 목록 - 불량 전체
async function selectAllDefected(connection, data) {
    const pageSize = 10;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where is_defected = 1 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[담당자] 검사 내역 목록 - 부품 별
async function selectDefectedSortByPart(connection, data) {
    const pageSize = 10;
    const part = data.part;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where is_defected = 1 and test.part_id = ${part} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[담당자] 검사 내역 목록 - 조치 결과 별
async function selectDefectedSortByResult(connection, data) {
    const pageSize = 10;
    const result = data.result;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test 
        where is_defected = 1 and test.is_fixed = ${result} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//[담당자] 검사 내역 목록 - 부품 별 / 조치 결과 별
async function selectDefectedSortByPartAndResult(connection, data) {
    const pageSize = 10;
    const part = data.part;
    const result = data.result;
    const start = data.start;

    const query = `
        select
            test_id as testId,
            (select part.name from part where test.part_id = part.part_id) as partName,
            is_defected as isDefected,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date
        from test
        where is_defected = 1 and test.is_fixed = ${result} and test.part_id = ${part} 
        order by test.created_at DESC 
        limit ${start}, ${pageSize};
        `
    const [rows] = await connection.query(query);
    return rows;
}

//검사 상세 내역
async function selectInspectionById(connection, testId) {
    const query = `
        select
            test_id as testId,
            (select member.name from member where member_id = test.tester_id) as tester,
            (select part.name from part where test.part_id = part.part_id) as partName,
            (select part.stock from part where test.part_id = part.part_id) as partStock,
            is_defected as isDefected,
            defected_type as defectedType,
            is_fixed as isFixed,
            date_format(created_at, '%Y/%m/%d %H:%i:%s') as date,
            (select memo.content from memo where test.memo_id = memo.memo_id) as memo,
            test.image_url as image
        from test 
        where test_id = ${testId};`

    const [rows] = await connection.query(query, [testId]);
    return rows;
}

module.exports = {
    test,
    insertInspection,
    selectAllInspection,
    selectInspectionSortByPart,
    selectInspectionSortByResult,
    selectInspectionSortByPartAndResult,
    selectAllDefected,
    selectDefectedSortByPart,
    selectDefectedSortByResult,
    selectDefectedSortByPartAndResult,
    selectInspectionById
};