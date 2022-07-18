const { main } = require('../services/main');

async function mainController(req, res) {
  try {
    const { user_id } = req.body;
    const data = await main(user_id);
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(err.statusCode).json({ message: err.message });
  }
}

async function genreController(req, res) {
  try {
    const { genre } = req.query;
    const data = await genre(genre);
    return res.status(201).json({ data });
  } catch (err) {
    return res.status(err.statusCode).json({ message: err.message });
  }
}

module.exports = {
  mainController,
  genreController,
};
