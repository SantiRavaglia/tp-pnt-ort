const songDao = require('../daos/song.dao.mongo.js');

exports.getAll = () => songDao.getAll();
exports.getById = (id) => songDao.getById(id);
exports.create = (data) => songDao.create(data);
exports.update = (id, data) => songDao.update(id, data);
exports.remove = (id) => songDao.remove(id);
