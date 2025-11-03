const Play = require('../../models/play');

module.exports = {
  create: async (p) => {
    const created = await Play.create(p);
    return created.toObject();
  },
  findByUser: async (userId) => {
    return (await Play.find({ userId }).lean()).map(x => ({ ...x, id: x._id }));
  },
  findBySong: async (songId) => (await Play.find({ songId }).lean()).map(x => ({ ...x, id: x._id })),
  findBySongs: async (songIds) => (await Play.find({ songId: { $in: songIds } }).lean()).map(x => ({ ...x, id: x._id })),
  getAll: async () => (await Play.find().lean()).map(x => ({ ...x, id: x._id })),
};
