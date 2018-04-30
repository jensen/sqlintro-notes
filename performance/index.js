const cohorts = require('./data/cohorts.json')
const students = require('./data/students.json')

/* Convert the array into an object with the id as the key. */
const indexed = cohorts.reduce((previous, current) => ({ ...previous, [current.id]: current }), {})

function slow() {

  /* Iterate through students, this takes n time. */
  return students.map(student => {

    /* Iterate through the cohorts, this takes n time. */
    const cohort = cohorts.find(cohort => cohort.id === student.cohort_id)

    /* Join the data and return the result. */
    return Object.assign(student, {
      cohort_id: cohort.id,
      cohort_name: cohort.name
    })
  })
}

function fast() {
  return students.map(student => {

    /* Use the precomputed list of indexes to find the cohort data in constant time. */
    const cohort = indexed[student.cohort_id]

    return Object.assign(student, {
      cohort_id: cohort.id,
      cohort_name: cohort.name
    })
  })
}

function measure(fn) {
  const start = new Date()
  for(let i = 0; i < 100000; i++) {
    fn()
  }
  return new Date() - start
}

console.log('Started')
console.log(`Slow takes ${measure(slow)}ms`)
console.log(`Fast takes ${measure(fast)}ms`)
