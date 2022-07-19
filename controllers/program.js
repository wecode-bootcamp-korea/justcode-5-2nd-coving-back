const { programInfo, programLike } = require('../services/program');

async function programController(req, res) {
  try {
    // 2
    const user_id = req.user_id;
    const programId = req.params.id;
    const data = await programInfo(user_id, programId);
    return res.status(201).json({ data }); // 5
  } catch (err) {
    // 2
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function programLikeController(req,res) {
  try {
    // 2
    const user_id = req.user_id;
    const programId = req.params.id
    const data = await programLike(user_id, programId);
    return res.status(201).json({ data }); // 5
  } catch (err) {
    // 2
    console.log(err);
    return res.status(err.statusCode).json({ message: err.message });
  }
}

module.exports = { programController, programLikeController };
