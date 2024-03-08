// import contacts (not connected to db)
const data = require('./data.js');
let contacts = data.contacts;

// db
const mongoose = require('mongoose');

if (process.argv.length < 5) {
  console.log('arguments should be: <db password>, <name>, <number>');
  process.exit(1);
}

const password = process.argv[4];
const MONGO_URI = `mongodb+srv://simone-dev:${encodeURIComponent(
  password
)}@cluster0.jhntdbu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(MONGO_URI);

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Contact = mongoose.model('Contact', contactSchema);

const contact = new Contact({
  name: process.argv[2],
  phone: process.argv[3],
});

// local
contacts.push(contact);

contact.save().then((result) => {
  console.log('Contact saved!');
  mongoose.connection.close();
});

// local
console.log(contacts);
