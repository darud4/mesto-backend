const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { makeToken } = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const DuplicateUser = require('../errors/DuplicateUser');
const BadRequest = require('../errors/BadRequest');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, password: hash, email,
    }))
    .then((user) => res.status(200).send({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      },
    }))
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else if (error.code === 11000) next(new DuplicateUser('Пользователь с таким email уже зарегистрирован'));
      else next(error);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = makeToken({ _id: user._id });
      res
        .status(200).send({ token });
    })
    .catch(next);
};

function getUserInfo(id, res, next) {
  return User.findById(id)
    .then((user) => {
      if (user) return res.status(200).send(user);
      throw new NotFound('Пользователь с таким id не найден в базе');
    })
    .catch(next);
}

module.exports.getOurUser = (req, res, next) => getUserInfo(req.user._id, res, next);

module.exports.getUser = (req, res, next) => getUserInfo(req.params.id, res, next);

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else next(error);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;
  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else next(error);
    });
};
