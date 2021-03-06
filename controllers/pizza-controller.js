const { Pizza } = require('../models');

// set up the routes
const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      //.populate() returns the comment info instead of just the id
      .populate({
        path: 'comments',
        select: '-__v', //the '-' sign means we don't care about the __v, so it wont return it
      })
      .select('-__v')
      .sort({ _id: -1 }) // return the items sorted in descending order by the _id value
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  // get one pizza by id
  getPizzaById({ params }, res) {
    // we can destructure the params out of the req
    Pizza.findOne({ _id: params.id })
      .populate({
        path: 'comments',
        select: '-__v',
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  /*
    In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). 
    But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!
  */
  // create pizza
  createPizza({ body }, res) {
    //here we can destructure body out of req
    Pizza.create(body)
      .then((dbPizzaData) => res.json(dbPizzaData))
      .catch((err) => res.status(400).json(err));
  },
  // There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them.
  // update a pizza by id
  updatePizza({ params, body }, res) {
    Pizza.findOneAndUpdate({ _id: params.id }, body, {
      new: true, // 'new: true' will return the new updated document. if set false, it'll send the original
      runValidators: true, // runvalidators will execute our validators upon submission of data
    })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).josn({ message: 'No pizza found with this id' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
  //delete pizza
  deletePizza({ params }, res) {
    Pizza.findOneAndDelete({ _id: params.id })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'nop pizza found with this id' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = pizzaController;
