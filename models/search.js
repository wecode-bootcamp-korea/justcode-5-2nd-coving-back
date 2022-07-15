const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//타이핑할 때 뜨는 검색 결과 가져오기
async function getInstantSearch(keyword) {
  const instantSearch = await prisma.$queryRawUnsafe(`
    SELECT pp.id as program_id, pp.title, pp.poster_img_url
    FROM program pp
    JOIN (SELECT p.id, JSON_ARRAYAGG(genre) as genre
        FROM program p
        JOIN genre_program gp on p.id = gp.program_id
        JOIN genre g on g.id = gp.genre_id
        GROUP BY p.id) pg on pg.id = pp.id
    JOIN (SELECT pp.program_id, JSON_ARRAYAGG(par.name) as creators
        FROM participants_program pp
        JOIN
            (SELECT p.id as pid, p.name, pt.type
            FROM participants p
            JOIN participant_type pt on pt.id = p.participant_type_id) par on par.pid = pp.participants_id
        GROUP BY pp.program_id) participants on pp.id = participants.program_id
    JOIN channel c on c.id = pp.channel_id
    where title like '%${keyword}%' or genre like '%${keyword}%' OR creators like '%${keyword}%' OR name like '%${keyword}%'
        `);
  return instantSearch;
}

//검색 결과 페이지
async function getSearchResult(keyword) {
  const searchResultAll = await prisma.$queryRawUnsafe(`
    SELECT pp.id as program_id, pp.title, pp.poster_img_url
    FROM program pp
    JOIN (SELECT p.id, JSON_ARRAYAGG(genre) as genre
        FROM program p
        JOIN genre_program gp on p.id = gp.program_id
        JOIN genre g on g.id = gp.genre_id
        GROUP BY p.id) pg on pg.id = pp.id
    JOIN (SELECT pp.program_id, JSON_ARRAYAGG(par.name) as creators
        FROM participants_program pp
        JOIN
            (SELECT p.id as pid, p.name, pt.type
            FROM participants p
            JOIN participant_type pt on pt.id = p.participant_type_id) par on par.pid = pp.participants_id
        GROUP BY pp.program_id) participants on pp.id = participants.program_id
    JOIN channel c on c.id = pp.channel_id
    where title like '%${keyword}%' or genre like '%${keyword}%' OR creators like '%${keyword}%' OR name like '%${keyword}%'
        `);
  return searchResultAll;
}

//실시간 인기 검색어 가져오기
async function getPopularSearch() {
  const popularSearch = await prisma.$queryRaw`
    `;
  return popularSearch;
}

//실시간 인기 검색어 ADD
async function addSearchLog(id) {
  const popularSearch = await prisma.$queryRaw`
        INSERT INTO popular_search_log (program_id, created_at)
        VALUES (${id}, DEFAULT);
    `;
  return popularSearch;
}

module.exports = {
  getInstantSearch,
  getPopularSearch,
  getSearchResult,
  addSearchLog,
};
