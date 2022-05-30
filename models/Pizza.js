const { Schema, model } = require('mongoose');

// create the Pizza schema to regulate how the data should look
const PizzaSchema = new Schema({
  pizzaName: {
    type: String, //here we use the built in javascript datatype
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now, //we use the build in js Date.now function
  },
  size: {
    type: String,
    default: 'Large',
  },
  toppings: [], //could also specify 'Array' instead
});

// create the Pizza model using the PizzaSchema, & name it
const Pizza = model('Pizza', PizzaSchema); // 'PizzaSchema could be replaced with the schema definition

//export the pizza model
module.exports = Pizza;
