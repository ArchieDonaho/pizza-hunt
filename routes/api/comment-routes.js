const router = require('express').Router();
const {
  addComment,
  removeComment,
  addReply,
  removeReply,
} = require('../../controllers/comment-controller');

// /api/comments/:id
router.route('/:pizzaId').post(addComment);

// /api/comments/:id/:commentid
router.route('/:pizzaId/:commentId').put(addReply).delete(removeComment); // we need both id's b/c after deleting the comment, we need to know which pizza the comment originated from

// /api/comments/:pizzaid/:commentid/:replyid
router.route('/:pizzaId/:commentId/:replyId').delete(removeReply);

module.exports = router;
