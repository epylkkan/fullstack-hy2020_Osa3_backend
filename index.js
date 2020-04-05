console.log('hello world')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('logentry', function (request, response, next) {
  if(request.method === 'POST') {
      return JSON.stringify(request.body)
  } 
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :logentry'))

app.get('/', (req, res) => {  
  res.send('<h1>Welcome to Phonebook</h1>')
})

let persons = 
[
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
]

app.get('/info', (request, response) => {
  const dateTimeNow = new Date()
  const numberOfPersons = persons.length
  response.send(`<div><p>Phonebook has info for ${numberOfPersons} people</p><p>${dateTimeNow}</p></div>`)
})

app.get('/api/persons', (request, response) => {
  //Person.find({}).then(p => {
  //response.json(p.map(p => p.toJSON()))
  response.json(persons)
  })
  

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)    
  } else {
    response.status(404).end()
  }
  
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
 
  const names = persons.map(p => p.name)
  if (names.includes(body.name)){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }
 
  const person = {
    name: body.name,
    number: body.number, 
    id: Math.floor(Math.random() * Math.floor(999999))
   // id: generateId()
  }

  
  persons = persons.concat(person)
  response.json(person)

     
  })

app.delete('/api/persons/:id', (request, response, next) => {
  const id = Number(request.params.id)
  
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()

})

/*
const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  return maxId + 1
}
*/
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})