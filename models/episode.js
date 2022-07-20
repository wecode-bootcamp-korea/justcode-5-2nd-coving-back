const { Prisma } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readEpisode(episodeId){
    const episodeInfo = await prisma.$queryRawUnsafe(`select episode.id, title, episode_num, episode.video_url from episode join program on program.id = episode.program_id where episode.id = ${episodeId};`)
    return episodeInfo;
}

async function readWatchHistory(user_id, episodeId){
    const watch_history_list = await prisma.$queryRawUnsafe(`select * from watching_history where user_id = ${user_id} and episode_id = ${episodeId};`)
    return watch_history_list;
}

async function createWatchHistory(user_id, episodeId){
    await prisma.$queryRawUnsafe(`insert into watching_history (user_id, episode_id) values (${user_id}, ${episodeId});`)
}

async function  updateWatchHistoryDate(user_id, episodeId){
    await prisma.$queryRawUnsafe(`UPDATE watching_history set updated_at = current_timestamp where user_id = ${user_id} and episode_id = ${episodeId};`)
}

async function readWatchHistoryByUserId(user_id){
    return await prisma.$queryRawUnsafe(`select episode.id, episode.img_url, program.title, episode.episode_num, t1.updated_at from (select * from watching_history where user_id = ${user_id}) as t1
    join episode on t1.episode_id = episode.id
    join program on episode.program_id = program.id order by updated_at desc;`);
}

async function deleteWatchHistoryById(user_id, episodeId){
    await prisma.$queryRawUnsafe(`delete from watching_history where user_id = ${user_id} and episode_id = ${episodeId};`)
}

module.exports = { readEpisode, readWatchHistory, createWatchHistory, updateWatchHistoryDate, readWatchHistoryByUserId, deleteWatchHistoryById }