const { Prisma } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readEpisode(episodeId){
    const episodeInfo = await prisma.$queryRawUnsafe(`select episode.id, title, episode_num, episode.video_url from episode join program on program.id = episode.program_id where episode.id = ${episodeId};`)
    return episodeInfo;
}

async function readWatchHistory(episodeId){
    const watch_history_list = await prisma.$queryRawUnsafe(`select * from watching_history where user_id = 1 and episode_id = ${episodeId};`)
    return watch_history_list;
}

async function createWatchHistory(episodeId){
    await prisma.$queryRawUnsafe(`insert into watching_history (user_id, episode_id) values (1, ${episodeId});`)
}

async function  updateWatchHistoryDate(episodeId){
    await prisma.$queryRawUnsafe(`UPDATE watching_history set episode_id = ${episodeId} where user_id = 1 and episode_id = ${episodeId};`)
}

module.exports = { readEpisode, readWatchHistory, createWatchHistory, updateWatchHistoryDate }