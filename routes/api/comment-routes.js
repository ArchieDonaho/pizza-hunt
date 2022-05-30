const router = require('express').Router();
const {
  addComment,
  removeComment,
} = require('../../controllers/comment-controller');

// /api/comments/:id
router.route('/:pizzaId').post(addComment);

// /api/comments/:id/:commentid
router.route('/:pizzaId/:commentId').delete(removeComment); // we need both id's b/c after deleting the comment, we need to know which pizza the comment originated from

module.exports = router;
