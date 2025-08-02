const User = require('./user');
const Token = require('./token');

// optional associations:
Token.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Token };
