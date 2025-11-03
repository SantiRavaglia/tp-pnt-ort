const albumDao = require('../daos/album.dao.mongo.js');

exports.getAll = () => albumDao.getAll();
exports.getById = (id) => albumDao.getById(id);
exports.create = (data) => albumDao.create(data);
exports.update = (id, data) => albumDao.update(id, data);
exports.remove = (id) => albumDao.remove(id);
