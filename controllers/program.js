const { programInfo, programLike } = require('../services/program');

async function programController(req, res) {
  try {
    const userId = req.userId;
    const programId = req.params.id;
    const data = await programInfo(userId, programId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function programLikeController(req,res) {
  try {
    const userId = req.userId;
    const programId = req.params.id
    const data = await programLike(userId, programId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = { programController, programLikeController };
