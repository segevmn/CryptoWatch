const watchlist = require('../models/watchlist');

exports.getWatchlist = async (req, res, next) => {
  try {
    const userId = req.userId;
    const userWatchlist = await watchlist.find({ userId: userId });

    if (userWatchlist.length === 0)
      return res.status(404).json({ msg: 'No coins on watchlist' });

    res.status(200).json({ watchlist: userWatchlist });
  } catch (err) {
    res.status(500).json({ errmsg: 'Error getting watchlist' });
  }
};
