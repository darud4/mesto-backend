require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthError = require('../errors/AuthError');

const { NODE_ENV, JWT_SECRET } = process.env;
const SECRET = NODE_ENV === 'production' ? JWT_SECRET : 'some-very-very-very-really-secret-key';

module.exports.makeToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '7d' });

module.exports.checkToken = function checkToken(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) throw new AuthError('Ошибка авторизации');
  const token = authorization.replace('Bearer ', '');

  //  const token = req.cookies.jwt;
  //  console.log('checkToken', req.cookies, token);
  let payload;
  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    throw new AuthError('Ошибка авторизации');
  }

  req.user = payload;
  return next();
};
