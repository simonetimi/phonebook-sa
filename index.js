const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact.js');

const PORT = process.env.PORT || 3001;
app.listen(PORT);

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
// morgan
morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
});
const logger = morgan(':method :url :status :body :res[content-length] - :response-time ms');
app.use(logger);

app.get('/api/persons', (request, response, next) => {
  try {
    Contact.find({}).then((contacts) => {
      response.json(contacts);
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/info', async (request, response, next) => {
  try {
    const numberOfPeople = await Contact.countDocuments({});
    const now = new Date();
    const info = `<p>Phonebook has ${numberOfPeople} contacts</p><p>${now}</p>`;
    response.send(info);
  } catch (error) {
    next(error);
  }
});

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id;
    const contact = await Contact.findById(id);
    if (!contact) {
      return response.status(404).json({
        error: 'Contact not found',
      });
    }
    response.json(contact);
  } catch (error) {
    next(error);
    return response.status(400).send({ error: 'Wrong ID format' });
  }
});

app.delete('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    await Contact.deleteOne({ _id: id });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', async (request, response, next) => {
  const id = request.params.id;
  const contact = request.body;
  try {
    await Contact.findByIdAndUpdate(id, contact);
    response.status(200).end();
  } catch (error) {
    next(error);
  }
});

app.post('/api/persons/', async (request, response, next) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'Contact name is missing',
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: 'Contact number is missing',
    });
  }

  try {
    const contactIsPresent = await Contact.findOne({ name: body.name });
    if (contactIsPresent) {
      return response.status(409).json({
        error: 'Contact is present',
      });
    }
    const contact = new Contact({ name: body.name, number: body.number });
    const savedContact = await contact.save();
    response.json(savedContact);
  } catch (error) {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

// error handler middleware
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Wrong ID format' });
  }
  if (error.name === 'NotFoundError') {
    return response.status(404).send({ error: 'Resource not found' });
  }
  if (error.name === 'MongoServerError') {
    return response.status(409).send({ error: 'Resource already present in the db' });
  }
  return response.status(500);
};
// last middleware to be called
app.use(errorHandler);
