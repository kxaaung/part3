require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', req => {
	return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
		return res.json(persons)
	})
})

app.get('/info', (req, res) => {
    const datetime = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`

    return res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(note => {
		res.json(note)
	})
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).end())
})

app.post('/api/persons', (req, res) => {
	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	}

	// const existedPerson = persons.find(p => p.name === body.name)
	// if (existedPerson) {
	// 	return res.status(400).json({
	// 		error: 'name must be unique'
	// 	})
	// }

	const person = new Person({
		name: body.name,
		number: body.number,
	})
	
	person.save().then(() => {
		return res.json(person)
	})
})

const unknowEndPoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'})
}

app.use(unknowEndPoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})