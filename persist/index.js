const fs = require('fs')
const path = require('path')

const express = require('express')
const parser = require('body-parser')

const app = express()

const pretty = json => JSON.stringify(json, null, 2)

const database = path.resolve(__dirname, './students.json')

/* Create the file if it doesn't exist. */
if(fs.existsSync(database) === false) fs.closeSync(fs.openSync(database, 'w+'))

/* Read the JSON file and when the result is passed through the callback, setup the server routes. */
fs.readFile(database, 'utf8', (error, result) => {
  const students = JSON.parse(result || '[]')

  app.use(parser.json())

  app.get('/', (request, response) => {
    response.setHeader('Content-Type', 'text/plain')
    response.send(pretty(students))
  })

  app.post('/students', (request, response) => {
    const student = {
      id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
      name: request.body.name,
      email: request.body.email,
      phone: request.body.phone,
      github: request.body.github
    }

    students.push(student)

    /* Serialize the object and write it to the JSON file. */
    fs.writeFile(database, pretty(students), 'utf-8', (error, result) => {
      console.log('Updated persistent data store.')

      response.setHeader('Content-Type', 'text/plain')
      response.status(201)
      response.send(pretty(student))
    })
  })

  app.listen(3000, () => {
    console.log(`Server listening on port 3000`)
  })

})
