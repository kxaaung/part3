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

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(persons => {
		return res.json(persons)
	})
	.catch(err => next(err))
})

app.get('/info', (req, res) => {
    const datetime = new Date()
    const info = `<p>Phonebook has info for ${persons.length} people</p><p>${datetime}</p>`

    return res.send(info)
})

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then(note => {
		return res.json(note)
	})
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body
	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, {new: true})
		.then(updatedPerson => {
			return res.json(updatedPerson)
		})
		.catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
		.then(result => res.status(204).end())
		.catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
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
	.catch(err => next(err))
})

const unknowEndPoint = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'})
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    }
    
    next(error)
}

app.use(unknowEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})