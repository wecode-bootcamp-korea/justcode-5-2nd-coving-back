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
    WHERE title LIKE '%${keyword}%' OR genre LIKE '%${keyword}%' OR creators LIKE '%${keyword}%' OR name LIKE '%${keyword}%'
        `);
  return instantSearch;
}

//검색 결과 페이지
async function getSearchResult(keyword) {
  console.log(keyword);
  const searchResultAll = await prisma.$queryRawUnsafe(`
    SELECT JSON_OBJECT("channel_name", c.name, "programs", JSON_ARRAYAGG(JSON_OBJECT("program_id", pp.id, "program_title", pp.title, "program_poster_url", pp.poster_img_url))) As a
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
    WHERE title LIKE '%${keyword}%' OR genre LIKE '%${keyword}%' OR creators LIKE '%${keyword}%' OR name LIKE '%${keyword}%'
    GROUP BY c.name
    `);
  return searchResultAll;
}

//실시간 인기 검색어 가져오기
async function getPopularSearch(limit = 10) {
  const popularSearch = await prisma.$queryRaw`
    SELECT program_id, p.title, count(*) as cnt
    FROM popular_search_log psl
    JOIN program p on p.id = psl.program_id
    WHERE psl.created_at BETWEEN DATE_ADD(NOW(), INTERVAL -1 WEEK ) AND NOW()
    GROUP BY program_id
    ORDER BY cnt DESC
    LIMIT ${limit};
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
