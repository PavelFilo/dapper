require('dotenv').config()
const express = require('express')
const { generateSignificantPoints } = require('./services/map')
const { getRouting } = require('./services/routing')
const { loadWeatherForecast } = require('./services/weather')
const cors = require('cors')
const app = express()
const port = 3002

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/generate-routes', async (req, res) => {
  try {
    console.log('req', req.body)
    const routes = await getRouting(req.body)
    res.send(routes)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.post('/pregenerate-map', (req, res) => {
  try {
    const points = generateSignificantPoints(req.body)
    res.send(points)
  } catch (error) {
    console.error(error)
    res.send(error)
  }
})

app.get('/weather-forecast', async (req, res) => {
  const data = await loadWeatherForecast()
  res.send(data)
})

app.listen(port, () => {
  console.log(`Dapper app listening on port ${port}`)
})
