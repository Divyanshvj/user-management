const { User } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// 1. Get Users (admin, with pagination and search)
exports.getUsers = async (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const where = search ? { [Op.or]: [
    { name: { [Op.like]: `%${search}%` } },
    { email: { [Op.like]: `%${search}%` } },
  ] } : {};

  const { count, rows } = await User.findAndCountAll({
    where,
    offset: (page-1)*limit,
    limit,
    attributes: { exclude: ['password'] },
  });
  res.json({ users: rows, total: count, page, pages: Math.ceil(count/limit) });
};

// 2. View/Edit Own Profile
exports.getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
  res.json(user);
};

// 3. Update Profile (name, profileImage)
exports.updateProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (req.body.name) user.name = req.body.name;
  if (req.file && req.file.filename) {
    if (user.profileImage && fs.existsSync(`uploads/${user.profileImage}`)) {
      fs.unlinkSync(`uploads/${user.profileImage}`);
    }
    user.profileImage = req.file.filename;
  }
  await user.save();
  res.json({ message: 'Profile updated.', user: { id: user.id, name: user.name, email: user.email, profileImage: user.profileImage } });
};
