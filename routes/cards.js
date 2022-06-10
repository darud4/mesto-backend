const router = require('express').Router();
const { celebrate } = require('celebrate');
const { createCardValidation, idValidation } = require('../utils/joiValidators');
const {
  createCard, getCards, deleteCard, setLike, removeLike,
} = require('../controllers/cards');

router.post('/', celebrate(createCardValidation), createCard);
router.get('/', getCards);
router.delete('/:id', celebrate(idValidation), deleteCard);
router.put('/:id/likes', celebrate(idValidation), setLike);
router.delete('/:id/likes', celebrate(idValidation), removeLike);

module.exports = router;
