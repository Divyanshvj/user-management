const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Token = sequelize.define('Token', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }, // 'emailVerify' | 'passwordReset'
  expires: { type: DataTypes.DATE, allowNull: false },
});

module.exports = Token;
