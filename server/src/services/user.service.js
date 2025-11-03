const userDao = require('../daos/user.dao.mongo.js');

exports.getAll = () => userDao.getAll();
exports.getById = (id) => userDao.getById(id);
exports.create = (data) => userDao.create(data);
exports.update = (id, data) => userDao.update(id, data);
exports.remove = (id) => userDao.remove(id);
