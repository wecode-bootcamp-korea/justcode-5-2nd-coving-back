const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readEpisode(episodeId){
    const episodeInfo = await prisma.$queryRawUnsafe(`select episode.id, title, episode_num, episode.video_url from episode join program on program.id = episode.program_id where episode.id = ${episodeId};`)
    return episodeInfo;
}

async function readWatchHistory(userId, episodeId){
    const watch_history_list = await prisma.$queryRawUnsafe(`select * from watching_history where user_id = ${userId} and episode_id = ${episodeId};`)
    return watch_history_list;
}

async function createWatchHistory(userId, episodeId){
    await prisma.$queryRawUnsafe(`insert into watching_history (user_id, episode_id) values (${userId}, ${episodeId});`)
}

async function  updateWatchHistoryDate(userId, episodeId){
    await prisma.$queryRawUnsafe(`INSERT INTO watching_history (user_id, episode_id) values (${userId}, ${episodeId}) ON DUPLICATE KEY UPDATE updated_at = current_timestamp;`)
}

async function readWatchHistoryByUserId(userId){
    return await prisma.$queryRawUnsafe(`select episode.id, episode.img_url, program.title, episode.episode_num, t1.updated_at from (select * from watching_history where user_id = ${userId}) as t1
    join episode on t1.episode_id = episode.id
    join program on episode.program_id = program.id order by updated_at desc;`);
}

async function deleteWatchHistoryById(userId, episodeId){
    await prisma.$queryRawUnsafe(`delete from watching_history where user_id = ${userId} and episode_id = ${episodeId};`)
}

module.exports = { readEpisode, readWatchHistory, createWatchHistory, updateWatchHistoryDate, readWatchHistoryByUserId, deleteWatchHistoryById }