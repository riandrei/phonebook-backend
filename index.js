const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("req-body", (request, response) => JSON.stringify(request.body));

app.use(
  morgan(
    `:method :url :status :res[content-length] - :response-time ms :req-body`
  )
);

let phonebookEntries = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.send(phonebookEntries);
});

app.get("/api/persons/:id", (request, response) => {
  const filteredEntry = phonebookEntries.find(
    (phonebookEntry) => phonebookEntry.id === Number(request.params.id)
  );

  if (filteredEntry) {
    response.send(filteredEntry);
  } else {
    response.status(404).end();
  }
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  const isExisting = phonebookEntries.filter(
    (phonebookEntry) => phonebookEntry.name === name
  );

  if (!name || !number) {
    response
      .status(400)
      .send({ error: `The name and number fields are required.` });
  } else if (isExisting.length > 0) {
    response.status(400).send({ error: `The name already exists.` });
  } else {
    const newEntry = {
      id: Math.floor(Math.random() * 1000 + 1),
      name,
      number,
    };

    phonebookEntries = phonebookEntries.concat(newEntry);
    response.send(newEntry);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  phonebookEntries = phonebookEntries.filter(
    (phonebookEntry) => phonebookEntry.id !== Number(request.params.id)
  );

  response.status(204).end();
});

app.get("/info", (request, response) => {
  const date = new Date();

  const data = `<p>Phonebook has info for ${phonebookEntries.length} people</p><p>${date}</p>`;

  response.send(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
