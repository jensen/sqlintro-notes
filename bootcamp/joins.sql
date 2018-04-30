DROP TABLE IF EXISTS cohorts CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- COHORTS

CREATE TABLE cohorts (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE
);

INSERT INTO cohorts (id, name, start_date, end_date) VALUES (1, 'FEB12', '2018-02-12T08:00:00.000Z', '2018-04-20T07:00:00.000Z');
INSERT INTO cohorts (id, name, start_date, end_date) VALUES (2, 'MAR12', '2018-03-12T07:00:00.000Z', '2018-05-18T07:00:00.000Z');
INSERT INTO cohorts (id, name, start_date, end_date) VALUES (3, 'APR09', '2018-04-09T07:00:00.000Z', '2018-06-15T07:00:00.000Z');

-- STUDENTS

CREATE TABLE students (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  cohort_id INTEGER REFERENCES cohorts(id) ON DELETE CASCADE
);

INSERT INTO students (id, name, start_date, end_date, cohort_id) VALUES (1, 'Sam Billings', '2018-02-12T08:00:00.000Z', '2018-04-20T07:00:00.000Z', 1);
INSERT INTO students (id, name, start_date, end_date, cohort_id) VALUES (2, 'Susan Hudson', '2018-02-12T08:00:00.000Z', '2018-04-20T07:00:00.000Z', null);
INSERT INTO students (id, name, start_date, end_date, cohort_id) VALUES (3, 'Malloy Jenkins', '2018-02-12T08:00:00.000Z', '2018-04-20T07:00:00.000Z', 3);

ALTER SEQUENCE cohorts_id_seq RESTART WITH 4;
ALTER SEQUENCE students_id_seq RESTART WITH 4;