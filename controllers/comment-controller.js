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
  // remove comment & delete it from the pizza
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ __id: params.commentId })
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'no comment with this id' });
        }
        // delete the comment form pizza & return the updated pizza model
        return Pizza.findOneAndUpdate(
          { __id: params.pizzaId },
          { $pull: { comments: params.commentId } }, // $pull removes the comment from pizza
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
};

module.exports = commentController;
