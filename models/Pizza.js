const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

// create the Pizza schema to regulate how the data should look
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String, //here we use the built in javascript datatype
    },
    createdBy: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now, //we use the build in js Date.now function
      get: (createdAtVal) => dateFormat(createdAtVal), //grab the date & format it using the function
    },
    size: {
      type: String,
      default: 'Large',
    },
    toppings: [], //could also specify 'Array' instead
    comments: [
      //associate comment model with the pizza model
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  // allow the usage of virtuals & getters
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false, // set to false b/c mongoose already returns the id, so we dont need it
  }
);

// get total count of comments and replies on retrieval (virtual)
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});
// create the Pizza model using the PizzaSchema, & name it
const Pizza = model('Pizza', PizzaSchema); // 'PizzaSchema could be replaced with the schema definition

//export the pizza model
module.exports = Pizza;
