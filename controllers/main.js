const { main, content } = require('../services/main');

async function mainController(req, res) {
  try {
    const user_id = req.user_id;
    const data = await main(user_id);

    return res.status(200).json({ data });
  } catch (err) {
    console.log('ERR:', err);
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function contentController(req, res) {
  try {
    const { genre, sort, channel } = req.query;
    const data = await content(genre, sort, channel);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(err.statusCode).json({ message: err.message });
  }
}

module.exports = {
  mainController,
  contentController,
};
