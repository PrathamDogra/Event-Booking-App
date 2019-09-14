const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    require: true
  }
});
//With the below line we have created a model which will be stored as a collection 
//in our cluster with the name of Event
module.exports = mongoose.model('Event',eventSchema);