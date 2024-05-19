const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

morgan.token('body', req => {
	return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    return res.json(persons)
})

app.get('/info', (req, res) => {
    const datetime = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`

    return res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(p => p.id === Number(req.params.id))
    if (person) {
        return res.json(person)
    } else {
        return res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter(p => p.id !== Number(req.params.id))
    
    return res.status(204).end()
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}

	const existedPerson = persons.find(p => p.name === body.name)
	if (existedPerson) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	}

	const person = {
		id: Math.floor(Math.random() * 10000),
		name: body.name,
		number: body.number,
	}
	persons = persons.concat(person)
	return res.json(person)
})

const unknowEndPoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'})
}

app.use(unknowEndPoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})