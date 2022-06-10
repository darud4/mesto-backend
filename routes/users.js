const router = require('express').Router();
const { celebrate } = require('celebrate');
const { idValidation, changeAvatarValidation, updateProfileValidation } = require('../utils/joiValidators');

const {
  getUsers, getUser, getOurUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getOurUser);
router.get('/:id', celebrate(idValidation), getUser);
router.patch('/me', celebrate(updateProfileValidation), updateProfile);
router.patch('/me/avatar', celebrate(changeAvatarValidation), updateAvatar);

module.exports = router;
