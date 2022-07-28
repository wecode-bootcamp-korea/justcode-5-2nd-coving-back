const serviceProgram = require('../services/program');

async function programController(req, res) {
  try {
    const userId = req.userId;
    const programId = req.params.id;
    const data = await serviceProgram.programInfo(userId, programId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function programLikeController(req, res) {
  try {
    const userId = req.userId;
    const programId = req.params.id;
    const data = await serviceProgram.programLike(userId, programId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function episodeController(req, res) {
  try {
    const episodeId = req.params.id;
    const userId = req.userId;
    const data = await serviceProgram.episodeInfo(episodeId);
    await serviceProgram.updateWatchHistory(userId, episodeId);
    return res.status(201).json({ data });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

const getInstantSearch = async (req, res) => {
  try {
    const { keyword } = req.query;
    const instantSearch = await serviceProgram.getProgramByKeyword(keyword);
    if (instantSearch.count === 0 || keyword == '') {
      return res.sendStatus(204);
    }
    return res.status(200).json(instantSearch);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getSearchResult = async (req, res) => {
  try {
    const { keyword } = req.query;
    const searchResult = await serviceProgram.getProgramByChannel(keyword);
    if (searchResult.count === 0 || keyword == '') {
      return res.sendStatus(204);
    }
    return res.status(200).json(searchResult);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getPopularSearch = async (req, res) => {
  try {
    const popularSearch = await serviceProgram.getProgramNameByPopularity();
    return res.status(200).json(popularSearch);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const addSearchLog = async (req, res) => {
  try {
    const { id } = req.params;
    await serviceProgram.addSearchLog(id);
    return res.status(201).json({ message: 'searchlog added successfully' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

async function mainController(req, res) {
  try {
    const userId = req.userId;
    const data = await serviceProgram.main(userId);

    return res.status(200).json({ data });
  } catch (err) {
    console.log('ERR:', err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function contentController(req, res) {
  try {
    const { genre, sort, channel } = req.query;
    const data = await serviceProgram.content(genre, sort, channel);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function mainController(req, res) {
  try {
    const userId = req.userId;
    const data = await serviceProgram.main(userId);

    return res.status(200).json({ data });
  } catch (err) {
    console.log('ERR:', err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

async function contentController(req, res) {
  try {
    const { genre, sort, channel } = req.query;
    const data = await serviceProgram.content(genre, sort, channel);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
}

module.exports = {
  programController,
  programLikeController,
  episodeController,
  getInstantSearch,
  getSearchResult,
  getPopularSearch,
  addSearchLog,
  mainController,
  contentController,
};
