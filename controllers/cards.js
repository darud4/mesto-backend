const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const NotAuthorized = require('../errors/NotAuthorized');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else next(error);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;
  const ourId = req.user._id;

  return Card.findById(id)
    .then((card) => {
      if (!card) throw new NotFound('Запрошенная карточка не найдена');
      if (card.owner.toString() !== ourId) throw new NotAuthorized('Нельзя удалить чужую карточку');
      return Promise.resolve();
    })
    .then(() => Card.findByIdAndDelete(id))
    .then((card) => {
      if (card) return res.status(200).send(card);
      throw new NotFound('Запрошенная карточка не найдена');
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch(next);
};

module.exports.setLike = (req, res, next) => {
  const ourUserId = req.user._id;
  const { id } = req.params;

  return Card.findByIdAndUpdate(
    id,
    {
      $addToSet: { likes: ourUserId },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      throw new NotFound('Запрошенная карточка не найдена');
    })
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else next(error);
    });
};

module.exports.removeLike = (req, res, next) => {
  const ourUserId = req.user._id;
  const { id } = req.params;

  return Card.findByIdAndUpdate(
    id,
    {
      $pull: { likes: ourUserId },
    },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (card) return res.status(200).send(card);
      throw new NotFound('Запрошенная карточка не найдена');
    })
    .catch((error) => {
      if (['ValidationError', 'CastError'].includes(error.name)) next(new BadRequest('Переданы неверные данные'));
      else next(error);
    });
};
