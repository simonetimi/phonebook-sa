const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const data = require('./data.js');
let contacts = data.contacts;

const { generateId } = require('./util.js');

const PORT = 3001;
app.listen(PORT);

app.use(cors());

app.use(express.json());

// morgan
morgan.token('body', (request) => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body);
  }
});
const logger = morgan(':method :url :status :body :res[content-length] - :response-time ms');
app.use(logger);

app.get('/api/persons', (request, response) => {
  response.json(contacts);
});

app.get('/api/info', (request, response) => {
  const numberOfPeople = contacts.length;
  const now = new Date();
  const info = `<p>Phonebook has ${numberOfPeople} contacts</p><p>${now}</p>`;
  response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const contact = contacts.filter((contact) => contact.id === id);
  if (contact.length < 1) {
    return response.status(404).json({
      error: 'Contact not found',
    });
  }
  response.json(contact);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const numbOfContacts = contacts.length;
  contacts = contacts.filter((contact) => contact.id !== id);
  if (contacts.length === numbOfContacts) {
    return response.status(404).json({
      error: 'Contact not found',
    });
  }
  response.status(204).end();
});

app.post('/api/persons/', (request, response) => {
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

  const contactIsPresent = contacts.some((contact) => body.name === contact.name);
  if (contactIsPresent) {
    return response.status(409).json({
      error: 'Contact is present',
    });
  }

  const contact = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  contacts = [...contacts, contact];

  response.json(contact);
});
