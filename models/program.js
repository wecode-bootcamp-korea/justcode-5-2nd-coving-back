const { Prisma } = require('@prisma/client');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function readProgram(user_id, programId) {
    
    const like = await prisma.$queryRawUnsafe`select count(*) as liked from program join interest on program.id = program_id
    join user on user.id = user_id where program.id = ${programId} and user.id = ${user_id};`
    //찜 여부
    let isLiked = 0;
    if(like[0].liked>0){
        isLiked = true;
    }
    else{
        isLiked = false;
    }//BigInt 문제해결
    
    const programInfo = await prisma.$queryRawUnsafe`with A as(
        select program.id, title, title_img_url, poster_img_url, summary, age_range, channel.name as channel ,json_arrayagg(json_object("type",type,"name", participants.name)) as participants from program 
        join participants_program on program.id = participants_program.program_id
        join participants on participants_program.participants_id = participants.id
        join participant_type on participant_type_id = participant_type.id
        join channel on program.channel_id = channel.id where program.id = ${programId} group by program.id 
        ),
        B as(
        select program.id, json_arrayagg(genre) as genres from program
        join genre_program on program.id = genre_program.program_id
        join genre on genre.id = genre_program.genre_id group by program.id
        ),
        C as(
        select program.id, json_arrayagg(json_object("id", episode.id, "episode_num", episode_num, "img_url", img_url, "video_url", video_url, "summary", episode.summary, "release_date", episode.release_date, "running_time", running_time)) as episode_info from program
        join episode on program.id = episode.program_id group by program.id
        )
        select A.*, B.genres, C.episode_info from A join B on A.id = B.id join C on A.id = C.id;`
    //프로그램 상세정보

    const genres = await prisma.$queryRawUnsafe`select json_arrayagg(genre) as genres from program
    join genre_program on program.id = genre_program.program_id
    join genre on genre.id = genre_program.genre_id where program.id = ${programId} group by program.id;`

    const genre1 = genres[0].genres[0];
    const genre2 = genres[0].genres[1];

    const similar_program_list = await prisma.$queryRawUnsafe`with A as(select program.id, title, poster_img_url, count(genre) as count, json_arrayagg(genre) as genres from program
    join genre_program on program.id = genre_program.program_id
    join genre on genre.id = genre_program.genre_id where genre = ${genre1} or genre = ${genre2} group by program.id having count >= 2)
    select A.id, A.title, A.poster_img_url from A where A.id != ${programId} limit 15;`
    // 비슷한 프로그램(장르 두개 다 겹치는 프로그램, 15개만)


    
    const with_program_list = await prisma.$queryRawUnsafe`with A as(
        select distinct user_id from program join episode on program.id = episode.program_id
        join watching_history on episode.id = watching_history.episode_id where program.id = ${programId}
        ),
        B as(
        select program.id, title, poster_img_url, user_id from program join episode on program.id = episode.program_id
        join watching_history on episode.id = watching_history.episode_id where program.id != ${programId}
        ),
        C as(
        select B.id, title, poster_img_url, count(title) as cnt from B join A on B.user_id = A.user_id group by title order by cnt desc limit 15
        )
        select C.id, title, poster_img_url from C;`
    // 해당 프로그램을 보는 유저들이 보는 프로그램 리스트(많이 보는순, top15)

    return { isLiked, programInfo, similar_program_list, with_program_list };
}

async function likeDelete(user_id, programId){
    return await prisma.$queryRawUnsafe`delete from interest where user_id = ${user_id} and program_id = ${programId}`
}

async function likeCreate(user_id, programId){
    return await prisma.$queryRawUnsafe`insert into interest (user_id, program_id) values (${user_id}, ${programId})`
}

async function likeRead(user_id, programId){
    const isLiked = await prisma.$queryRawUnsafe`select * from program join interest on program.id = program_id
    join user on user.id = user_id where program.id = ${programId} and user.id = ${user_id};`

    return isLiked;
}

async function readLikeByUserId(user_id){
    return await prisma.$queryRawUnsafe(`select program.id, program.title, program.poster_img_url from interest join program on program.id = interest.program_id where user_id = ${user_id} order by interest.created_at desc;`);
}

async function deleteLikeHistoryById(user_id, programId){
    await prisma.$queryRawUnsafe(`delete from interest where user_id = ${user_id} and program_id = ${programId};`)
}

module.exports = { readProgram, likeDelete, likeCreate, likeRead, readLikeByUserId, deleteLikeHistoryById };
