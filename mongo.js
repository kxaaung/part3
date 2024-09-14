const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to ', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to ', url)
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

module.exports = mongoose
