const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const querybuilder = require('./querybuilders');
async function readWatchingHistory(user) {
  const listByIsWatching = await prisma.$queryRaw`
  SELECT
     ep.program_id,
     wa.episode_id,
     p.title,
     p.poster_img_url,
     ep.episode_num,
     ep.video_url
FROM (SELECT *
        FROM watching_history wh 
        JOIN (SELECT max(wh.id) as max_id
                FROM watching_history wh JOIN episode e ON (wh.episode_id = e.id)
               WHERE wh.user_id = ${user}
               GROUP BY e.program_id
               ORDER by e.program_id desc) bb ON (wh.id = bb.max_id)) wa
        JOIN episode ep ON (wa.episode_id = ep.id)
        JOIN program p ON (program_id = p.id);
 `;
  return listByIsWatching;
}

async function readProgramsByPopularity() {
  const listByPopularity = await prisma.$queryRaw`
    SELECT 
      p.id AS program_id, 
      p.title, 
      p.poster_img_url, 
      pgg.genres, 
      p.summary
    FROM popular_search_log ps
    JOIN program p ON p.id =ps.program_id
    JOIN(
      SELECT p.id, p.title, JSON_ARRAYAGG(g.genre) AS genres
      FROM program p
      JOIN genre_program gp ON p.id = gp.program_id
      JOIN genre g ON gp.genre_id = g.id
      GROUP BY p.id
        )pgg ON pgg.id = p.id
    GROUP BY p.id
    ORDER BY COUNT(ps.program_id) DESC
  `;
  return listByPopularity;
}

async function getGenre() {
  const genre = await prisma.$queryRaw`
    SELECT genre 
    FROM genre
    `;
  return genre;
}

async function readProgramsByGenre(randomGenre) {
  const listByGenre = await prisma.$queryRaw`
  SELECT
    p.id AS program_id,
    p.title,
    p.poster_img_url,
    JSON_ARRAYAGG(g.genre) genres,
    p.summary
  FROM genre g
  JOIN genre_program gp ON gp.genre_id = g.id
  JOIN program p ON gp.program_id = p.id
  WHERE g.genre = ${randomGenre}
  GROUP BY p.id
  `;
  return listByGenre;
}

async function getDirector() {
  const director = await prisma.$queryRaw`
    SELECT pa.name AS directors
    FROM participants pa
    JOIN participant_type pt ON pt.id = pa.participant_type_id
    WHERE pt.id = 1
    `;
  return director;
}

async function readProgramsByDirector(randomDirector) {
  const listByDirector = await prisma.$queryRaw`
    SELECT
      p.id AS program_id,
      p.title,
      p.poster_img_url,
      pgg.genres,
      p.summary
    FROM participants pa
    JOIN participants_program pp ON pp.participants_id = pa.id
    JOIN program p ON pp.program_id = p.id
    JOIN(
      SELECT p.id, p.title, JSON_ARRAYAGG(g.genre) AS genres
      FROM program p
      JOIN genre_program gp ON p.id = gp.program_id
      JOIN genre g ON gp.genre_id = g.id
      GROUP BY p.id
    )pgg ON pgg.id = p.id
    WHERE pa.name=${randomDirector}
`;
  return listByDirector;
}

async function getActor() {
  const actor = await prisma.$queryRaw`
  SELECT pa.name AS actors
  FROM participants pa
  JOIN participant_type pt ON pt.id = pa.participant_type_id
  WHERE pt.id = 2
    `;
  return actor;
}

async function readProgramsByActor(randomActor) {
  const listByActor = await prisma.$queryRaw`
  SELECT
    p.id AS program_id,
    p.title,
    p.poster_img_url,
    pgg.genres,
    p.summary
  FROM participants pa
  JOIN participants_program pp ON pp.participants_id = pa.id
  JOIN program p ON pp.program_id = p.id
  JOIN(
    SELECT p.id, p.title, JSON_ARRAYAGG(g.genre) AS genres
    FROM program p
    JOIN genre_program gp ON p.id = gp.program_id
    JOIN genre g ON gp.genre_id = g.id
    GROUP BY p.id
  )pgg ON pgg.id = p.id
  WHERE pa.name=${randomActor}
`;

  return listByActor;
}

async function readContentByFilter(genre, sort, channel) {
  const result = await prisma.$queryRawUnsafe(`
  SELECT
    p.id AS program_id,
    p.title,
    p.poster_img_url
  FROM program p
  JOIN genre_program gp ON gp.program_id = p.id
  JOIN genre g ON gp.genre_id = g.id
  JOIN channel c ON c.id = p.channel_id
  LEFT JOIN popular_search_log ps ON ps.program_id = p.id
  ${querybuilder.generateWhereQuery(genre, channel)}
  GROUP BY p.id
  ${querybuilder.generateSortQuery(sort)};
  `);

  return result;
}

async function readProgram(userId, programId) {
  const like = await prisma.$queryRawUnsafe`
    SELECT count(*) as liked 
    FROM interest 
    WHERE program_id = ${programId} and user_id = ${userId};`;

  //찜 여부
  let isLiked = 0;
  if (like[0].liked > 0) {
    isLiked = true;
  } else {
    isLiked = false;
  } //BigInt 문제해결

  const data = await prisma.$queryRawUnsafe(`
    SELECT episode.episode_num, episode.video_url 
    FROM 
        (SELECT * 
         FROM watching_history 
         where user_id = ${userId}) as t1
    join episode on t1.episode_id = episode.id
    join program on episode.program_id = program.id where program.id = ${programId} 
    order by updated_at desc limit 1;`);

  let episode_num;
  let video_url;

  if (data.length == 0) {
    episode_num = null;
    video_url = null;
  } else {
    episode_num = data[0].episode_num;
    video_url = data[0].video_url;
  }
  const latest_watching_episode = [
    {
      episode_num: episode_num,
      video_url: video_url,
    },
  ];

  const programInfo = await prisma.$queryRawUnsafe`with A as(
        SELECT program.id, title, title_img_url, poster_img_url, summary, age_range, channel.name as channel ,json_arrayagg(json_object("type",type,"name", participants.name)) as participants FROM program 
        join participants_program on program.id = participants_program.program_id
        join participants on participants_program.participants_id = participants.id
        join participant_type on participant_type_id = participant_type.id
        join channel on program.channel_id = channel.id where program.id = ${programId} group by program.id 
        ),
        B as(
        SELECT program.id, json_arrayagg(genre) as genres FROM program
        join genre_program on program.id = genre_program.program_id
        join genre on genre.id = genre_program.genre_id group by program.id
        ),
        C as(
        SELECT program.id, json_arrayagg(json_object("id", episode.id, "episode_num", episode_num, "img_url", img_url, "video_url", video_url, "summary", episode.summary, "release_date", episode.release_date, "running_time", running_time)) as episode_info FROM program
        join episode on program.id = episode.program_id group by program.id
        )
        SELECT A.*, B.genres, C.episode_info FROM A join B on A.id = B.id join C on A.id = C.id;`;
  //프로그램 상세정보

  return { isLiked, latest_watching_episode, programInfo };
}

async function getSimilarProgram(programId) {
  const genres =
    await prisma.$queryRaw`SELECT json_arrayagg(genre) as genres FROM program
    join genre_program on program.id = genre_program.program_id
    join genre on genre.id = genre_program.genre_id where program.id = ${programId} group by program.id;`;

  const genre1 = genres[0].genres[0];
  const genre2 = genres[0].genres[1];

  // 비슷한 프로그램(장르 두개 다 겹치는 프로그램, 15개만)
  const similar_program_list =
    await prisma.$queryRawUnsafe`with A as(SELECT program.id, title, poster_img_url, count(genre) as count, json_arrayagg(genre) as genres FROM program
    join genre_program on program.id = genre_program.program_id
    join genre on genre.id = genre_program.genre_id where genre = ${genre1} or genre = ${genre2} group by program.id having count >= 2)
    SELECT A.id, A.title, A.poster_img_url FROM A where A.id != ${programId} limit 15;`;
  return similar_program_list;
}

async function getWithProgram(programId) {
  // 해당 프로그램을 보는 유저들이 보는 프로그램 리스트(많이 보는순, top15)
  const with_program_list = await prisma.$queryRawUnsafe`with A as(
        SELECT distinct user_id FROM program join episode on program.id = episode.program_id
        join watching_history on episode.id = watching_history.episode_id where program.id = ${programId}
        ),
        B as(
        SELECT program.id, title, poster_img_url, user_id FROM program join episode on program.id = episode.program_id
        join watching_history on episode.id = watching_history.episode_id where program.id != ${programId}
        ),
        C as(
        SELECT B.id, title, poster_img_url, count(title) as cnt FROM B join A on B.user_id = A.user_id group by title order by cnt desc limit 15
        )
        SELECT C.id, title, poster_img_url FROM C;`;
  return with_program_list;
}

async function likeDelete(userId, programId) {
  return await prisma.$queryRawUnsafe`delete FROM interest where user_id = ${userId} and program_id = ${programId}`;
}

async function likeCreate(userId, programId) {
  return await prisma.$queryRawUnsafe`insert into interest (user_id, program_id) values (${userId}, ${programId})`;
}

async function likeRead(userId, programId) {
  const isLiked =
    await prisma.$queryRawUnsafe`SELECT * FROM program join interest on program.id = program_id
    join user on user.id = user_id where program.id = ${programId} and user.id = ${userId};`;

  return isLiked;
}

async function readLikeByUserId(userId) {
  return await prisma.$queryRawUnsafe(
    `SELECT program.id, program.title, program.poster_img_url FROM interest join program on program.id = interest.program_id where user_id = ${userId} order by interest.created_at desc;`
  );
}

async function deleteLikeHistoryById(userId, programId) {
  await prisma.$queryRawUnsafe(
    `delete FROM interest where user_id = ${userId} and program_id = ${programId};`
  );
}

//타이핑할 때 뜨는 검색 결과 가져오기
async function getProgramByKeyword(keyword) {
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
      WHERE ${querybuilder.searchFilter(keyword)}
          `);
  return instantSearch;
}

//검색 결과 페이지
async function getProgramByChannel(keyword) {
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
      WHERE ${querybuilder.searchFilter(keyword)}
      GROUP BY c.name
      `);
  return searchResultAll;
}

//실시간 인기 검색어 가져오기
async function getProgramNameByPopularity(limit = 10) {
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

async function readEpisode(episodeId) {
  const episodeInfo = await prisma.$queryRawUnsafe(
    `SELECT episode.id, title, episode_num, episode.video_url FROM episode join program on program.id = episode.program_id where episode.id = ${episodeId};`
  );
  return episodeInfo;
}

async function readWatchHistory(userId, episodeId) {
  const watch_history_list = await prisma.$queryRawUnsafe(
    `SELECT * FROM watching_history where user_id = ${userId} and episode_id = ${episodeId};`
  );
  return watch_history_list;
}

async function createWatchHistory(userId, episodeId) {
  await prisma.$queryRawUnsafe(
    `insert into watching_history (user_id, episode_id) values (${userId}, ${episodeId});`
  );
}

async function updateWatchHistoryDate(userId, episodeId) {
  await prisma.$queryRawUnsafe(
    `INSERT INTO watching_history (user_id, episode_id) values (${userId}, ${episodeId}) ON DUPLICATE KEY UPDATE updated_at = current_timestamp;`
  );
}

async function readWatchHistoryByUserId(userId) {
  return await prisma.$queryRawUnsafe(`SELECT episode.id, episode.img_url, program.title, episode.episode_num, t1.updated_at FROM (SELECT * FROM watching_history where user_id = ${userId}) as t1
      join episode on t1.episode_id = episode.id
      join program on episode.program_id = program.id order by updated_at desc;`);
}

async function deleteWatchHistoryById(userId, episodeId) {
  await prisma.$queryRawUnsafe(
    `delete FROM watching_history where user_id = ${userId} and episode_id = ${episodeId};`
  );
}

module.exports = {
  readWatchingHistory,
  readProgramsByPopularity,
  getGenre,
  readProgramsByGenre,
  getDirector,
  readProgramsByDirector,
  getActor,
  readProgramsByActor,
  readContentByFilter,
  readProgram,
  likeDelete,
  likeCreate,
  likeRead,
  readLikeByUserId,
  deleteLikeHistoryById,
  getSimilarProgram,
  getWithProgram,
  getProgramByKeyword,
  getProgramByChannel,
  getProgramNameByPopularity,
  addSearchLog,
  readEpisode,
  readWatchHistory,
  createWatchHistory,
  updateWatchHistoryDate,
  readWatchHistoryByUserId,
  deleteWatchHistoryById,
};
