const service = require('../services/stats.service');

exports.userListenTime = async (req, res, next) => {
  try {
    const result = await service.userListenTime(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.songListenTime = async (req, res, next) => {
  try {
    const result = await service.songListenTime(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.albumListenTime = async (req, res, next) => {
  try {
    const result = await service.albumListenTime(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.artistListenTime = async (req, res, next) => {
  try {
    const result = await service.artistListenTime(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};

exports.userListenTimeByDay = async (req, res, next) => {
  try {
    const result = await service.userListenTimeByDay(req.params.id);
    res.json(result);
  } catch (err) { next(err); }
};
