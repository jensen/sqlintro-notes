# An Introduction to SQL

The data is your product. That is why SQL is important. SQL is the window into this data. You will learn just enough to do some basic operations. Understanding the basics of inserting and selecting data will allow you to build any of the midterm projects.

SQL is an incredible language for querying large data sets. As a company collects more data they gain insight into their customers behaviour. This allows them to run their business more efficiently.

The example we will use today includes the type of model you would expect for a bootcamp. We will have cohorts and students. The students will have created assistance requests and assignment submissions. We can use this data to gain insights that normally are unclear.

SQL isn't like other languages. Keep that in mind while you are exploring it. It won't feel right because it will be confusing at first and hard for a while.

This language has been around since 1974. It's older than most of us. The strength of SQL has allowed it to endure all of these years.

> All of the queries were run using PostgreSQL 10.1

## Data Persistence

What do CSV, XML and JSON have in common? They allow us to format our data in a way that makes it easier to work with. We can classify and relate data.

- CSV
- XML
- JSON

JSON is not perfect in any way. It does provide benefits over CSV and XML. We can easily convert JavaScript objects into JSON using the `JSON.stringify()` method. This is a process called serialization. The opposite process is called deserialization. It will convert JSON text to a JavaScript object using `JSON.parse()`. We can add persistence by saving each change to a text file. Load the data from the file and provide it as the default data object when the server starts.

The `persist/` directory contains an example of an express app that saves it's database object to a file. After installing the dependencies you can run the app and go to `http://localhost:3000/` to see a list of students. I can use an HTTP client like cURL to make a request to create a student.

```bash
curl -H "Content-Type: application/json" -X POST -d '{"name":"Baxter Acerbi", "email":"bacerbi@email.com", "phone":"800 555 4567"}' -v http://localhost:3000/students
```

The server would create the record as an object add it to the array of students and then write the serialize array to the `students.json` file.

I like to use a tool called [HTTPie](https://httpie.org/) to make requests. I find that the commands are less verbose than with cURL. Postman is another popular option.

```bash
http POST localhost:3000/students name='Baxter Acerbi' email='bacerbi@email.com' phone='800 555 4567' github=baxcer`
```

## Relational Database Management System (RDBMS)

Saving a JSON file to storage provides persistence but not much else. It will not scale. A database like MongoDB provides a wrapper around this concept. You can create documents. Each one of the documents is a JSON object. That way you aren't as limited by reading and writing to the single file.

You will use a [RDBMS](https://en.wikipedia.org/wiki/Relational_database_management_system) for your midterm.

A RDBMS provides benefits that make it the choice for web application developers around the world.

- Reduce the duplication of data.
- Provide a robust query language.
- Accurately model reality.

We will use [PostgreSQL](https://www.postgresql.org/about/) which is a popular relational database impelementation. There are others:

- SQLite3
- MySQL
- MSSQL
- MariaDB
- ...

## Database Normalization

Database normalization allows us to realize one of the major benefits of relational databases. We normalize our database to reduce duplicate data.

It is incredibly difficult to manage a database that stores the same information in several places. Let's imagine that we stored our student data denormalized.

```
+--------------------------------------+
| students                             |
+--------------------------------------+
| id | name              | cohort_name |
+--------------------------------------+
| 1  | Sam Billings      | FEB12       |
| 2  | Susan Hudson      | MAR12       |
| 3  | Malloy Jenkins    | APR09       |
| 4  | Maximilian Alesio | APR09       |
| 5  | Pegasus Larue     | APR09       |
+--------------------------------------+
```

We would consider this denormalized because the cohort name is repeated for 3 of the students. In order to normalize this database we would split the data into two related tables.

```
+------------------------------------+   +------------+
| students                           |   | cohorts    |
+------------------------------------+   +------------+
| id | name              | cohort_id |   | id | name  |
+------------------------------------+   +------------+
| 1  | Sam Billings      | 1         |   | 1  | FEB12 |
| 2  | Susan Hudson      | 2         |   | 2  | MAR12 |
| 3  | Malloy Jenkins    | 3         |   | 3  | APR09 |
| 4  | Maximilian Alesio | 3         |   +------------+
| 5  | Pegasus Larue     | 3         |
+------------------------------------+
```

We show that each student belongs to a cohort. The details of the cohort are stored separately. When we need to gather this information together we use a query to ask the database for it in the structure that we want.

If we needed to change the name of a cohort for any reason we only need to change the one field in the `cohorts` table.

## ERD

An Entity Relationship Diagram helps us design the schema of a database. You can use a pen and paper, a whiteboard or an online tool like [draw.io](http://draw.io/). The key is to iterate on the design before commiting it to the database. This is a situation where you __ALWAYS__ save time by planning.

### Naming Convention

We use naming conventions to increase consistency which provides us with some level of predictability. We can write queries faster if we don't have to look up column names constantly. Follow these rules to start with:

- Use `snake_case` for table and column names.
- Pluralize tables names, column names should be singular.
- Call your primary key `id`. Why not?
- For most foreign keys use `<table>_id`.

```
+----------------+
|    students    |  <-- Plural
+----------------+
| PK | id        |  <-- Primary Key
|    | name      |  <-- Singular
| FK | cohort_id |  <-- <table>_id
+----------------+
```

Here is an example [SQL Style Guide](http://www.sqlstyle.guide/). I'm not recomending the style specifically, it provides an example of how a style guide would be defined.

### Relationships

When defining relationships between tables you will often want to create a one-to-many. An example of this is a cohort having many students. We place a foreign key on the students table that points to a record in the cohorts table.

```
       MANY                            ONE
+-----------------+            +-----------------+
|     students    |            |     cohorts     |
+-----------------+            +-----------------+
| PK | id         |       /----| PK | id         |
|    | name       |      /     |    | name       |
|    | email      |\    /      |    | start_date |
| FK | cohort_id  |----/       |    | end_date   |
|    | start_date |/           +-----------------+
|    | end_date   |
+-----------------+
```

__The foreign key is on the many side.__ *The foreign key is on the many side.* `The foreign key is on the many side.`

```ruby
(`-')       (`-').->  (`-')  _
( OO).->    (OO )__   ( OO).-/
/    '._   ,--. ,'-' (,------.
|'--...__) |  | |  |  |  .---'
`--.  .--' |  `-'  | (|  '--.
   |  |    |  .-.  |  |  .--'
   |  |    |  | |  |  |  `---.
   `--'    `--' `--'  `------'

                         (`-')   (`-')  _   _                 <-. (`-')_
   <-.          .->   <-.(OO )   ( OO).-/  (_)         .->       \( OO) )
(`-')-----.(`-')----. ,------,) (,------.  ,-(`-')  ,---(`-') ,--./ ,--/
(OO|(_\---'( OO).-.  '|   /`. '  |  .---'  | ( OO) '  .-(OO ) |   \ |  |
 / |  '--. ( _) | |  ||  |_.' | (|  '--.   |  |  ) |  | .-, \ |  . '|  |)
 \_)  .--'  \|  |)|  ||  .   .'  |  .--'  (|  |_/  |  | '.(_/ |  |\    |
  `|  |_)    '  '-'  '|  |\  \   |  `---.  |  |'-> |  '-'  |  |  | \   |
   `--'       `-----' `--' '--'  `------'  `--'     `-----'   `--'  `--'

<-.(`-')   (`-')  _                  _       (`-').->
 __( OO)   ( OO).-/      .->        (_)      ( OO)_
'-'. ,--. (,------.  ,--.'  ,-.     ,-(`-') (_)--\_)
|  .'   /  |  .---' (`-')'.'  /     | ( OO) /    _ /
|      /) (|  '--.  (OO \    /      |  |  ) \_..`--.
|  .   '   |  .--'   |  /   /)     (|  |_/  .-._)   \
|  |\   \  |  `---.  `-/   /`       |  |'-> \       /
`--' '--'  `------'    `--'         `--'     `-----'

           <-. (`-')_     (`-')       (`-').->  (`-')  _
     .->      \( OO) )    ( OO).->    (OO )__   ( OO).-/
(`-')----. ,--./ ,--/     /    '._   ,--. ,'-' (,------.
( OO).-.  '|   \ |  |     |'--...__) |  | |  |  |  .---'
( _) | |  ||  . '|  |)    `--.  .--' |  `-'  | (|  '--.
 \|  |)|  ||  |\    |        |  |    |  .-.  |  |  .--'
  '  '-'  '|  | \   |        |  |    |  | |  |  |  `---.
   `-----' `--'  `--'        `--'    `--' `--'  `------'

<-. (`-')   (`-')  _  <-. (`-')_                 (`-').->   _       _(`-')     (`-')  _
   \(OO )_  (OO ).-/     \( OO) )     .->        ( OO)_    (_)     ( (OO ).->  ( OO).-/
,--./  ,-.) / ,---.   ,--./ ,--/  ,--.'  ,-.    (_)--\_)   ,-(`-')  \    .'_  (,------.
|   `.'   | | \ /`.\  |   \ |  | (`-')'.'  /    /    _ /   | ( OO)  '`'-..__)  |  .---'
|  |'.'|  | '-'|_.' | |  . '|  |)(OO \    /     \_..`--.   |  |  )  |  |  ' | (|  '--.
|  |   |  |(|  .-.  | |  |\    |  |  /   /)     .-._)   \ (|  |_/   |  |  / :  |  .--'
|  |   |  | |  | |  | |  | \   |  `-/   /`      \       /  |  |'->  |  '-'  /  |  `---. ,-.
`--'   `--' `--' `--' `--'  `--'    `--'         `-----'   `--'     `------'   `------' '-'

```

There are situations where you may have multiple foreign keys on a single table. This creates a many-to-many relationship. The table used for this is often called a 'join' table.

```
+----------------------+
|  assisance_requests  |
+----------------------+
| PK | id              |
|    | name            |
| FK | student_id      | A student has many assistance requests.
| FK | teacher_id      | A teacher accepts many assistance requests.
| FK | assignment_id   |
|    | created_at      |
|    | started_at      |
|    | completed_at    |
|    | student_rating  |
|    | teacher_rating  |
+----------------------+
```

This join table has a purpose. It holds information relevant to the relationship. In this case an assistance request joins students to teachers. Assignments are also attached but that isn't required.

## Schema

### Data Types

When defining columns for the tables you will need to specify the data type. `INTEGER, VARCHAR, TEXT, BOOLEAN, DATE` are common examples.

- Primary key column. Use the name `id` and then `SERIAL PRIMARY KEY NOT NULL`.
- Names, emails, usernames and passwords can all be stored as `VARCHAR(255)`.
- Foreign key columns. Add `_id` to the singular name of the column you are referencing. Students to cohorts would be `cohort_id`. The type would be `INTEGER` but you also should create the foreign key with `REFERENCES cohorts(id) ON DELETE CASCADE`.
- Dates would use the `DATE` type. If you needed [date and time](https://www.postgresql.org/docs/current/static/datatype-datetime.html) you would use `TIMESTAMP`.

You will use `INTEGER` to represent most [numbers](https://www.postgresql.org/docs/current/static/datatype-numeric.html). There are other *sizes* of integers as well.

- __SMALLINT__ -32,768 to 32,767 (thirty-two thousand)
- __INTEGER__ -2,147,483,648 to 2,147,483,647 (two billion)
- __BIGINT__ -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807 (nine quintillion)
- __SERIAL__ 1 to 2,147,483,647 (auto incrementing)

### Dates, Phone Numbers & Currency

- Become familiar with the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) date formatting standard. The string `'2018-02-12'` uses this format to represent 'February 12th, 2018'. Year, month and then day. Dates should be stored consistently. Apply timezones and formatting when displayed to the user.
- Store phone numbers as `VARCHAR`, there are so many possible formats. The number `214 748 3647` hits our `INTEGER` limit.
- Store currency as an integer representing cents. Use a `BIGINT` if you need values over $21 million dollars.
- Read up on assumptions made by people with regard to peoples names. [Falsehoods Programmers Believe About Names](https://www.kalzumeus.com/2010/06/17/falsehoods-programmers-believe-about-names/)

There is a [list](https://github.com/kdeldycke/awesome-falsehood) of other resources discussing falsehoods. Gender is no longer considered binary. Addresses, language and units of measurement are all poorly understood by most of us. The good news is that there is a collection of information out there that we previously did not have access to. The Internet.

### Indexes

We are able to define [indexes](https://www.postgresql.org/docs/current/static/indexes.html) on tables. Any column can be an index but not all columns make good indexes.

Adding a `PRIMARY KEY` satisfies the minimum indexing requirements for a table. A table requires at least one column that is guaranteed to have a unique value for each row.

__A JavaScript Example__

The concept of indexing isn't specific to databases. This example shows how indexing can work for you in JavaScript. In both cases we use the technique to improve the performance of an application.

__Array__

```javascript
const students = [
  { id: 'cjvbZq', name: 'Tajana Meyrick' },
  { id: 'DJHa7I', name: 'Delfina Hayes' },
  { id: 'hEWmRa', name: 'Filip Bell' },
  { id: 'Ck9YNg', name: 'Amie Fabbro' },
  { id: 'AG7piI', name: 'Radoslav Pavlov' },
  { id: 'rtwj0V', name: 'Embla Bösch' },
  { id: 'VbnpoA', name: 'Natalia Armati' }
]
```

I know the `id` for the record I want to find. The approach I take is different based on the data structure I'm using. In this example we want the record with the `id` of 'rtwj0V'. It's easy for us when we can see the whole data set. Without searching I can tell you that is the 'Embla Bösch' record.

To search the Array programatically I would write code like this:

```javascript
const student = students.find(student => {
  return student.id === 'rtwj0V'
})
```
- [MDN Array.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find)

The code would execute and each record in the list would be checked for that `id`. It would find it on the 6th iteration.

__Object__

```javascript
const students = {
  'cjvbZq': { id: 'cjvbZq', name: 'Tajana Meyrick' },
  'DJHa7I': { id: 'DJHa7I', name: 'Delfina Hayes' },
  'hEWmRa': { id: 'hEWmRa', name: 'Filip Bell' },
  'Ck9YNg': { id: 'Ck9YNg', name: 'Amie Fabbro' },
  'AG7piI': { id: 'AG7piI', name: 'Radoslav Pavlov' },
  'rtwj0V': { id: 'rtwj0V', name: 'Embla Bösch' },
  'VbnpoA': { id: 'VbnpoA', name: 'Natalia Armati' }
}
```

Since we know the id we are looking for then we could do an object lookup instead. An object lookup is even more simple:

```javascript
const student = students['rtwj0V']
```

This is __MUCH__ faster for the JavaScript engine to execute.

Examine the example in `performance/` to see the difference in execution time between these two approaches. If you are starting with an Array then sometimes it is a good idea to create an index (object with keys pointing directly to records). The code to generate the index is:

```javascript
const indexed = students.reduce((previous, current) => {
  const record = {
    [current.id]: current
  }

  return Object.assign({}, previous, record)
}, {})
```

- [MDN Array.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
- [MDN Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [MDN Object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)

Now back to databases.

## The Structured Query Language (SQL)

Our goal is to build web applications. We can get away with an adequate understanding of SQL. If you are going to focus on user interface development then allocate your time to learning CSS. If you want to work on web servers then learn SQL. Learn how to use it to make your job easier and your application faster.

It is common to refer to most web applications as CRUD applications. The purpose is to facilitate the Creation, Reading, Updating and Deletion of resources. The four major types of queries follow this pattern as well.

- Create becomes INSERT
- Read becomes SELECT
- Update is UPDATE and is *dangerous*
- Delete is DELETE and is *dangerous*

### Database Client

Before we can query for anyting we need to connect to the database with a client. We will begin by using `psql` which should be installed for you already.

When connecting to a database you generally have to know the hostname, username, password, port and database name. When you run `psql --help` you will be provided with details on the options you can use to start the client. Near the bottom there are 'Connection options'. These should show you what the default values are for your hostname, port and username.

Since your username is `vagrant` and there is a username setup then you won't have to specify this information. The most important thing when running this command is that you provide the correct database. If you do not provide a database then one will be selected for you with a name that matches your username.

```bash
> psql w4d1 # connect to the w4d1 database

psql (10.1)
Type "help" for help.

w4d1=# SELECT * FROM cohorts;
```

We can type queries ending with the semi-colon. Then hit enter.

```bash
 id | name  | start_date |  end_date
----+-------+------------+------------
  1 | FEB12 | 2018-02-12 | 2018-04-20
  2 | MAR12 | 2018-03-12 | 2018-05-18
  3 | APR09 | 2018-04-09 | 2018-06-15
(3 rows)
```

__Importing Schema__

If you have a `schema.sql` file that contains a number of commands you want to run you can use `psql w4d1 < schema.sql`. If you have already started the client then you can use the command `\i schema.sql`. If there is an error that the file cannot be found then make sure you are in the right directory.

> All queries in these examples have been run on the `bootcamp/seed.sql` data set.

### Creating a Table

We know what our schema looks like and we can send commands to the database. When creating a table we provide the types and contraints to the named columns.

```sql
CREATE TABLE cohorts (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE
);
```

> If you want to create a foreign key then use `INTEGER REFERENCES other(id) ON DELETE CASCADE`

### Altering a Table

We are not stuck with our initial schema. We can modify existing tables. Some actions you could take:

- Add or remove a column.
- Change an existing column type.
- Add or remove an index.

[ALTER TABLE](https://www.postgresql.org/docs/current/static/sql-altertable.html)

```sql
ALTER TABLE cohorts
ADD COLUMN location VARCHAR(255);
```

### Removing a Table

[DROP TABLE](https://www.postgresql.org/docs/current/static/sql-droptable.html)

This can be dangerous, but if you need to remove your table you can do that.

```sql
DROP TABLE IF EXISTS cohorts CASCADE;
```

Notice that the `CASCADE` is being triggered so all student records that depend on this table will also be deleted.

[TRUNCATE TABLE](https://www.postgresql.org/docs/current/static/sql-truncate.html)

You can also remove the contents of a table and retain the schema using `TRUNCATE TABLE`. There are a lot of considerations when doing this. Any sequences would need to be reset for example.

### CREATE/INSERT

Before we can search for data we need to add it. In order to create records in a table we use the [INSERT](https://www.postgresql.org/docs/current/static/sql-insert.html) command.

```sql
INSERT
INTO cohorts (
  name,
  start_date,
  end_date
) VALUES (
  'FEB12',
  '2018-02-12T08:00:00.000Z',
  '2018-04-20T07:00:00.000Z'
);
```

If you need to insert multiple records at the same time a single query is quicker than many. It is important to do as few queries as possible to keep performance high.

```sql
INSERT INTO cohorts (name, start_date, end_date) VALUES
('FEB12', '2018-02-12T08:00:00.000Z', '2018-04-20T07:00:00.000Z'),
('MAR12', '2018-03-12T07:00:00.000Z', '2018-05-18T07:00:00.000Z'),
('APR09', '2018-04-09T07:00:00.000Z', '2018-06-15T07:00:00.000Z'),
('MAY07', '2018-05-07T07:00:00.000Z', '2018-07-13T07:00:00.000Z');
```

### READ/SELECT

The selection of data is likely to cause the most confusion for you. There are 6 different clauses that you would use to query for data.

- __SELECT__ - List the columns and aggregate data you are interested in.
- __FROM__ - Provide one or more tables that you want data from.
- __WHERE__ - Only select records that match a condition.
- __GROUP BY__ - Combine the results based on a column so an aggregate can be applied to each group.
- __HAVING__ - Only select the results that match a condition.
- __ORDER BY__ - Describe the parameters for the results ordering.

Some examples of things that you may want to do with a database.

> I want all of the data from the students table.

This will display the rows and all of the columns for all records in the students table.

```sql
SELECT * FROM students;

 id  |           name           | start_date |  end_date  | cohort_id
-----+--------------------------+-------------------------------------
   1 | Armand Hilll             | 2018-02-12 | 2018-04-20 |         1
   2 | Stephanie Wolff          | 2018-02-12 | 2018-04-20 |         1
   3 | Stan Miller              | 2018-02-12 | 2018-04-20 |         1
   4 | Elliot Dickinson         | 2018-02-12 | 2018-04-20 |         1

```

> I want all of the data for some of the fields on the students table.

This will display the id, name and cohort_id rows from the students table.

```sql
SELECT id, name, cohort_id FROM students;

 id  |           name           | cohort_id
-----+--------------------------+-----------
   1 | Armand Hilll             |         1
   2 | Stephanie Wolff          |         1
   3 | Stan Miller              |         1
   4 | Elliot Dickinson         |         1
```

> I want to see how many students there are.

This will display the number of rows, which represents the number of students.

```sql
SELECT count(id) FROM students;

 count
-------
   192
```

> I want to see how many students there are in a specific cohort.

This will display the count for all the rows matching the condition of the cohort being id 1. With the `AS` clause we can alias the column name to give us more descriptive results.

```sql
SELECT count(id) AS student_count FROM students WHERE cohort_id = 1;

 student_count
---------------
            18
```

> I want to see how many students there are in each cohort.

This will display a list of cohort ids and the number of students in each.

```sql
SELECT cohort_id, count(id) AS student_count FROM students GROUP BY cohort_id;

 cohort_id | student_count
-----------+---------------
         6 |            14
         7 |            11
         9 |            22
         5 |            19
         4 |            14
        11 |            22
        10 |            11
         3 |            19
         2 |            11
         1 |            18
        12 |            20
         8 |            11
```

> I want to see which cohorts have more than 20 students.

This will display a filtered result set based on the count value being higher than 20.

```sql
SELECT cohort_id, count(id) AS student_count FROM students GROUP BY cohort_id HAVING count(id) >= 18;

 cohort_id | student_count
-----------+---------------
         9 |            22
         5 |            19
        11 |            22
         3 |            19
         1 |            18
        12 |            20
```

> I want to order my previous results with the highest counts at the top of the list.

This will display the previous results sorted high to low.

```sql
SELECT
  cohort_id,
  count(id) AS student_count
FROM students
GROUP BY cohort_id
HAVING count(id) >= 18
ORDER BY count(id) DESC;

 cohort_id | student_count
-----------+---------------
         9 |            22
        11 |            22
        12 |            20
         5 |            19
         3 |            19
         1 |            18
```

> I want the previous result set, but only for students that started before August 1st.

This will display a smaller result set than before. The difference is the filtering is done after the aggregation.

```sql
SELECT
  cohort_id,
  count(id) AS student_count
FROM students
WHERE start_date < '2018-08-01'
GROUP BY cohort_id
HAVING count(id) >= 18
ORDER BY count(id) DESC;

 cohort_id | student_count
-----------+---------------
         5 |            19
         3 |            19
         1 |            18
```

### UPDATE & DELETE

These queries seem to be a lot simpler than ones that begin with `SELECT`. The `UPDATE` and `DELETE` are the most dangerous queries because they change or remove data. This means you need to be very careful when using either of them. Never write an `UPDATE` or `DELETE` query without a `WHERE` clause.

Here is a [story](https://www.reddit.com/r/cscareerquestions/comments/6ez8ag/accidentally_destroyed_production_database_on/) about a situation where a developer deleted the production database on their first day. It wasn't their fault but how many times could you do this before you could no longer get hired?

The key take away is to be extra careful working on production databases. Test all your update and delete operations on a development database.

[UPDATE](https://www.postgresql.org/docs/current/static/sql-update.html)

Let's say that a student has changed their name part way through the program. We could update more than one column at a time for the user with an `id` of 3.

```sql
UPDATE students
SET name='Callisto Caiazzo', email='ccaiazzo@gmail.com', github='callcazz'
WHERE id = 3;
```

[DELETE](https://www.postgresql.org/docs/current/static/sql-delete.html)

I'm not sure why you would ever delete your own data. If you want to delete a specific row you specify a `WHERE` clause.

```sql
DELETE FROM students WHERE id = 3;
```

I prefer to have a `deleted_at` column that stores a DATE. That way you can still filter out deleted results without having to lose the data. Storage is not expensive.

You've seen a reference to `ON DELETE CASCADE` for foreign key references. If we delete a cohort then we may want to delete all of the students that point to the record. The cascading delete functionality is a [constraint](https://www.postgresql.org/docs/current/static/ddl-constraints.html). It is not necessary to use CASCADE. If you don't you may notice some issues when trying to delete something that has a foreign reference to it.

## JOIN

There are 5 kinds of joins.

- `INNER JOIN` is the same as `JOIN`
- `LEFT OUTER JOIN` is the same as `LEFT JOIN`
- `RIGHT OUTER JOIN` is the same as `RIGHT JOIN`
- `FULL OUTER JOIN` is the same as `OUTER JOIN`
- `CROSS JOIN`

When performing a `JOIN` you define that type of join, the two tables involved in the operation and the condition that is used to join on.

```sql
SELECT * FROM T1 JOIN T2 ON <condition>;
```

In this example `T1` is the table on the `LEFT` of the join and `T2` is on the `RIGHT`. This becomes important when working with `OUTER JOIN`.

When we start joining tables we need to be unambiguous. We will target columns by table.column naming.

- `students.id`
- `students.name`
- `cohorts.name`

[Queries with FROM](https://www.postgresql.org/docs/current/static/queries-table-expressions.html#QUERIES-FROM)

### INNER JOIN

With an `INNER JOIN` only rows where the `ON` condition is met are included in the results. In the example when the `JOIN` is done we won't find 'Susan Hudson' in the results, she doesn't belong to a cohort.

```
+---------------------------------+        +------------+
| students                        |  JOIN  | cohorts    |
+---------------------------------+        +----+-------+
| id | name           | cohort_id |        | id | name  |
+---------------------------------+        +------------+
| 1  | Sam Billings   | 1         |        | 1  | FEB12 |
| 2  | Susan Hudson   | null      |        | 2  | MAR12 |
| 3  | Malloy Jenkins | 3         |        | 3  | APR09 |
+---------------------------------+        +------------+
```

```sql
SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM students
INNER JOIN cohorts
ON cohorts.id = students.cohort_id;
```

```
+-----------------------------------+
| id | name           | cohort_name |
+-----------------------------------+
| 1  | Sam Billings   | FEB12       |
| 3  | Malloy Jenkins | APR09       |
+-----------------------------------+
```

Notice that the `cohorts.id = students.cohort_id` condition was not satisfied for the second row in the `students` table.

### OUTER JOIN

The `OUTER JOIN` requires us to specify whether it is the `LEFT` or `RIGHT` table that is used to provide unmatched rows. For any row where the condition was not met a row is added with null for columns from the second table.

```
+---------------------------------+        +------------+
| students                        |  JOIN  | cohorts    |
+---------------------------------+        +----+-------+
| id | name           | cohort_id |        | id | name  |
+---------------------------------+        +------------+
|  1 | Sam Billings   | 1         |        |  1 | FEB12 |
|  2 | Susan Hudson   | null      |        |  2 | MAR12 |
|  3 | Malloy Jenkins | 3         |        |  3 | APR09 |
+---------------------------------+        +------------+
```

```sql
SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM students
LEFT OUTER JOIN cohorts
ON cohorts.id = students.cohort_id;
```

```
+-----------------------------------+
| id | name           | cohort_name |
+-----------------------------------+
|  1 | Sam Billings   | FEB12       |
|  2 | Susan Hudson   | null        |
|  3 | Malloy Jenkins | APR09       |
+-----------------------------------+
```

Since this was a `LEFT JOIN` after all the rows are matched the remaining ones are appended.

__RIGHT OUTER JOIN__

This is an uncommon join. Since we have to specify the side to join on we have two options. In the above example the cohorts table is on the right side of the join. If we turn this into a `RIGHT OUTER JOIN` then we get different results back.

```sql
SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM students
RIGHT OUTER JOIN cohorts
ON cohorts.id = students.cohort_id;

    id |  student_name  | cohort_name
-------+----------------+-------------
     1 | Sam Billings   | FEB12
     3 | Malloy Jenkins | APR09
  null | null           | MAR12
```

If we wanted the same results as above with a `RIGHT JOIN` then we would need to alter the query to put the students table on the right side of the join.

```sql
SELECT students.id, students.name AS student_name, cohorts.name AS cohort_name
FROM cohorts
RIGHT OUTER JOIN students
ON students.cohort_id = cohorts.id;
```

### CROSS JOIN

Using a `CROSS JOIN` we can get the cartesian product. A row for every student and a row for every cohort. This isn't very useful and is only provided for completeness.

```sql
SELECT *
FROM cohorts
CROSS JOIN students;
```

Which achieves the same result set as:

```sql
SELECT *
FROM cohorts, students;
```

Adding a where clause to filter out the duplicate results acts just like an `INNER JOIN`.

```sql
SELECT *
FROM cohorts, students
WHERE cohorts.id = students.cohort_id;
```

## Bonus

Thank you for reading this far. It means a lot to me.

Soon you will be introduced to ORM (Object Relational Mapping) libraries. The most popular one is [ActiveRecord](http://guides.rubyonrails.org/active_record_basics.html) made popular by the Rails framework. The [Active Record pattern](https://martinfowler.com/eaaCatalog/activeRecord.html) was released in the 2002 book [Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html).

When you are working on the ActiveRecord material later in the program take a look at the SQL queries being generated. It will show up in the output. ActiveRecord can *feel* easier than SQL because it hides the queries from you.

__Database Libraries__

- Last ORM I tried: http://docs.sequelizejs.com/
- Most Popular ORM: https://github.com/rails/rails/tree/master/activerecord/
- Migrations: http://knexjs.org/
- Others told me to avoid: http://bookshelfjs.org/
- Next one I'll try: https://github.com/typeorm/typeorm/
