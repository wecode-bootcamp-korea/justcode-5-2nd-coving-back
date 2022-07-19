const { main, content } = require('../services/main');

async function mainController(req, res) {
  try {
    const { user_id } = req.body;
    const data = await main(user_id);
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function contentController(req, res) {
  try {
    const { genre, sort, channel } = req.query;
    const data = await content(genre, sort, channel);
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(err.statusCode).json({ message: err.message });
  }
}

module.exports = {
  mainController,
  contentController,
};
