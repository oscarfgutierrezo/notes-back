import express from "express";
import cors from "cors";

const app = express();

// Middleware global que analizará automáticamente el cuerpo JSON de todas las solicitudes entrantes.
// Un Middleware es una función que se ejecuta entre la recepción de una solicitud HTTP y el envío de una respuesta.
app.use(express.json());
app.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World</h1>");
});

// Obtener recursos
app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// Eliminar recursos
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

// Agregar recurso
const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

// Agregar recurso
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "Content missing",
    });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: body.important || false,
    date: new Date(),
  };

  notes = [...notes, note];
  response.json(note);
});

// Modificar recurso
app.put("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const noteIsStored = notes.some((note) => note.id === id);
  const infoUpdated = request.body;

  if (!noteIsStored) {
    return response
      .status(400)
      .json({ error: `There is no note with ID ${id}` });
  }

  notes = notes.map((note) => {
    if (note.id === id) {
      return infoUpdated;
    } else {
      return note;
    }
  });

  const noteUpdated = notes.find((note) => note.id === id);

  response.status(201).json(noteUpdated);
});

// Iniciar el servidor para que escuche en el puerto indicado
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
