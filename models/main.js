const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readByGenreFilter(genreId) {
  const listByGenrePopularity = await prisma.$queryRaw`
  SELECT
    p.id,
    p.title,
    p.poster_img_url
  FROM genre g
  JOIN genre_program gp ON gp.genre_id = g.id
  JOIN program p ON gp.program_id = p.id
  JOIN popular_search_log ps ON ps.program_id = p.id
  WHERE g.id = ${genreId}
  GROUP BY p.id
  ORDER BY COUNT(ps.program_id) DESC
`;


const listByGenreMostRecent(genreId) = await prisma.$queryRaw`
  SELECT
    p.id,
    p.title,
    p.poster_img_url,
  FROM genre g
  JOIN genre_program gp ON gp.genre_id = g.id
  JOIN program p ON gp.program_id = p.id
  WHERE g.id = ${genreId}
  GROUP BY p.id
  ORDER BY p.created_at DESC
`;

//채널 필터를 하나 더 추가할때?


  return { listByGenrePopularity,listByGenreMostRecent};
}

async function readMain(userId) {
  const listByIsWatching = await prisma.$queryRaw`
  SELECT
  ep.program_id,
     wa.episode_id,
     p.title,
     p.poster_img_url,
     ep.episode_num,
     ep.video_url
FROM (SELECT *
        FROM watching_history wh JOIN (SELECT max(wh.id) as max_id
                FROM watching_history wh JOIN episode e ON (wh.episode_id = e.id)
               WHERE wh.user_id = ${userId}
               GROUP BY e.program_id
               ORDER by e.program_id desc) bb ON (wh.id = bb.max_id)) wa
               JOIN episode ep ON (wa.episode_id = ep.id)
               JOIN program p ON (program_id = p.id);
 `;

  const listByPopularity = await prisma.$queryRaw`
    SELECT 
      p.id, 
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

  const genre = await prisma.$queryRaw`
    SELECT JSON_ARRAYAGG(g.genre) AS genres 
    FROM genre g
    `;
  const randomGenre =
    genre[0].genres[Math.floor(Math.random() * genre[0].genres.length)];

  const listByGenre = await prisma.$queryRaw`
  SELECT
    p.id,
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

  const director = await prisma.$queryRaw`
    SELECT JSON_ARRAYAGG(pa.name) AS directors
    FROM participants pa
    JOIN participant_type pt ON pt.id = pa.participant_type_id
    WHERE pt.id = 1
    `;

  const randomDirector =
    director[0].directors[
      Math.floor(Math.random() * director[0].directors.length)
    ];
  const listByDirector = await prisma.$queryRaw`
    SELECT
      p.id,
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

  const actor = await prisma.$queryRaw`
  SELECT JSON_ARRAYAGG(pa.name) AS actors
  FROM participants pa
  JOIN participant_type pt ON pt.id = pa.participant_type_id
  WHERE pt.id = 2
    `;
  const randomActor =
    actor[0].actors[Math.floor(Math.random() * actor[0].actors.length)];

  const listByActor = await prisma.$queryRaw`
  SELECT
    p.id,
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

  return {
    listByIsWatching,
    listByPopularity,
    listByGenre,
    listByDirector,
    listByActor,
  };
}

module.exports = {
  readMain,
  readByGenreFilter,
};
