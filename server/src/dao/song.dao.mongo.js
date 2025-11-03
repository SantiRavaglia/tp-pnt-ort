const DAOFactory = require('../dao/factory');
const userDAO = DAOFactory.getUserDAO('memory');

exports.getAllUsers = async () => {
  return await userDAO.getAll();
};

exports.getUserById = async (id) => {
  return await userDAO.getById(id);
};

exports.getUsersByAge = async (range) => {
  return await userDAO.getByAge(range);
};

exports.createUser = async (userData) => {
  return await userDAO.create(userData);
};

exports.updateUser = async (id, userData) => {
  return await userDAO.update(id, userData);
};

exports.deleteUser = async (id) => {
  return await userDAO.delete(id);
};
