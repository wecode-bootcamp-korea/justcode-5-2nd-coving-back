const program = require('../models/program');

async function programInfo(userId, programId) {
  const { isLiked, latest_watching_episode, programInfo } =
    await program.readProgram(userId, programId);
  const similar_program_list = await program.getSimilarProgram(programId);
  const with_program_list = await program.getWithProgram(programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  console.log(programInfo);
  return {
    isLiked,
    latest_watching_episode,
    programInfo,
    similar_program_list,
    with_program_list,
  };
}

async function programLike(userId, programId) {
  const { programInfo } = await program.readProgram(userId, programId);
  if (!programInfo) {
    const error = new Error('PROGRAM_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  const isLiked = await program.likeRead(userId, programId);
  console.log(isLiked);
  if (isLiked.length == 0) {
    await program.likeCreate(userId, programId);
    return { isLiked: true };
  } else {
    await program.likeDelete(userId, programId);
    return { isLiked: false };
  }
}

async function main(userId) {
  const listByIsWatching = await program.readWatchingHistory(userId);
  const listByPopularity = await program.readProgramsByPopularity();
  const genre = await program.getGenre();
  const director = await program.getDirector();
  const actor = await program.getActor();
  const randomGenre = genre[Math.floor(Math.random() * genre.length)].genre;
  const randomDirector =
    director[Math.floor(Math.random() * director.length)].directors;
  const randomActor = actor[Math.floor(Math.random() * actor.length)].actors;
  const listByGenre = await program.readProgramsByGenre(randomGenre);
  const listByActor = await program.readProgramsByActor(randomActor);
  const listByDirector = await program.readProgramsByDirector(randomDirector);
  if (!main) {
    const error = new Error('MAIN_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return {
    listByIsWatching,
    listByPopularity,
    listByGenre,
    listByActor,
    listByDirector,
  };
}

async function content(genre, sort, channel) {
  const content = await program.readContentByFilter(genre, sort, channel);
  if (!content) {
    const error = new Error('CONTENT_NOT_FOUND');
    error.StatusCode = 404;
    throw error;
  }
  return content;
}

async function getProgramByKeyword(keyword) {
  const instantSearchList = await program.getProgramByKeyword(keyword);
  console.log(instantSearchList);
  const count = instantSearchList.length;
  const result = { count: count, dataList: instantSearchList };
  return result;
}

async function getProgramByChannel(keyword) {
  const searchResultList = await program.getProgramByChannel(keyword);
  const rawResult = await program.getProgramByKeyword(keyword);
  const count = rawResult.length;
  const newDataList = [];
  searchResultList.forEach(element => {
    newDataList.push(...Object.values(element));
  });

  const result = { count: count, dataList: newDataList };
  return result;
}

async function getProgramNameByPopularity() {
  const popularSearch = await program.getProgramNameByPopularity();
  popularSearch.forEach(element => {
    delete element.cnt;
  });
  return popularSearch;
}

async function addSearchLog(id) {
  return await program.addSearchLog(id);
}

async function episodeInfo(episodeId) {
  const episodeInfo = await program.readEpisode(episodeId);
  if (!episodeInfo) {
    const error = new Error('EPISODE_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  return episodeInfo;
}

async function updateWatchHistory(userId, episodeId) {
  const episodeInfo = await program.readEpisode(episodeId);
  if (episodeInfo.length == 0) {
    const error = new Error('EPISODE_NOT_FOUND');
    error.statusCode = 404;
    throw error;
  }
  await program.updateWatchHistoryDate(userId, episodeId);
}

module.exports = {
  programInfo,
  programLike,
  main,
  content,
  getProgramByKeyword,
  getProgramByChannel,
  getProgramNameByPopularity,
  addSearchLog,
  episodeInfo,
  updateWatchHistory,
};
