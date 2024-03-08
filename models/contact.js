const mongoose = require('mongoose');
require('dotenv').config();

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Contact', contactSchema);
