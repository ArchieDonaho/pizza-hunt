const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } }, // we use the $push method to add the comment's id to the specific pizza we want to update. Same as the push() method in js to add data to the end of an array
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  // add a reply to a comment
  addReply({ params, body }, res) {
    // we are updating since reply is part of the comment object
    Comment.findOneAndUpdate(
      { _id: params.commentId }, // where
      { $push: { replies: body } }, // what to do/update
      { new: true, runValidators: true } // additional options
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'no pizza found with this id' });
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  // remove comment & delete it from the pizza
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ __id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'no comment with this id' });
        }
        // delete the comment form pizza & return the updated pizza model
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } }, // $pull removes the comment from pizza. "pull out the comment where params = commentId"
          // $addToSet will do the same as $add, except will prevent uplicates
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  // remove reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      // $pull is a mongodb operator that will remove a specific reply from the replies array where replyId matches the value of params.replyId
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.json(err));
  },
};

module.exports = commentController;
