const artistDao = require('../daos/artist.dao.mongo.js');

exports.getAll = () => artistDao.getAll();
exports.getById = (id) => artistDao.getById(id);
exports.create = (data) => artistDao.create(data);
exports.update = (id, data) => artistDao.update(id, data);
exports.remove = (id) => artistDao.remove(id);
