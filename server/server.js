const express = require('express')
const path = require('path')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

// Replace with your actual database name
const dbPath = path.join(__dirname, 'your_database_name.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const outputResult = dbObject => {
  return {
    id: dbObject.id,
    title: dbObject.title,
    price: dbObject.price,
    description: dbObject.description,
    category: dbObject.category,
    image: dbObject.image,
    sold: dbObject.sold,
    dateOfSale: dbObject.dateOfSale
  }
}

// Replace with your actual table name
const tableName = 'transactions'

// GET /transactions/
app.get('/transactions/', async (request, response) => {
  const { search_q = '', title, description, price } = request.query
  const query = `
    SELECT * FROM ${tableName} 
    WHERE
      title LIKE '%' || ? || '%' 
      OR description LIKE '%' || ? || '%' 
      OR price LIKE '%' || ? || '%'
    ORDER BY
      id;
  `;
  try {
    const info = await db.all(query, [search_q, search_q, search_q])
    response.send(info.map(outputResult))
  } catch (error) {
    response.status(500).send({ error: error.message })
  }
})

// GET /statistics/
app.get('/statistics/', async (request, response) => {
  const getStatisticsQuery = `
    SELECT SUM(price) AS total_sale, COUNT(id) AS total_items_sold
    FROM ${tableName}
    WHERE 
      sold = 'sold';
  `;
  try {
    const info = await db.get(getStatisticsQuery)
    response.send(info)
  } catch (error) {
    response.status(500).send({ error: error.message })
  }
})

// Implementing /total/ endpoint if needed
app.get('/total/', async (request, response) => {
  const getTotalQuery = `
    SELECT COUNT(*) AS total_transactions FROM ${tableName};
  `;
  try {
    const total = await db.get(getTotalQuery)
    response.send(total)
  } catch (error) {
    response.status(500).send({ error: error.message })
  }
})
