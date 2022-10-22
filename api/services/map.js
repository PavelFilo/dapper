const fs = require('fs')
const { tin, pointsWithinPolygon } = require('@turf/turf')
const {
  MIN_SNOW_VALUE,
  SIGNIFICANT_POINTS_PATH,
  AMOUNT_OF_POINTS,
} = require('./constants')
const { SIGNIFICANT_POINTS } = require('./mock')
const { loadWeatherForecast } = require('./weather')
const { storeGeoJSON } = require('./helper')
const { prepareSignificantPoints } = require('./significantPointsGenerator')

const generateTinForWeather = (weatherData, minSnowValue) => {
  const dataToProcess = {
    type: 'FeatureCollection',
    features: weatherData[weatherData.length - 1].points.map(
      ({ lat, lon, value }) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          z: value,
        },
      })
    ),
  }

  const tinMap = tin(dataToProcess, 'z')

  return {
    type: 'FeatureCollection',
    features: tinMap.features.filter(
      (polygon) =>
        (polygon.properties.a + polygon.properties.b + polygon.properties.c) /
          3 >
        (minSnowValue || MIN_SNOW_VALUE)
    ),
  }
}

const getPointsToClear = async (body) => {
  const weatherData = await loadWeatherForecast()

  const significantPoints = loadSignificantPointsFromFile()
  const tinMap = generateTinForWeather(weatherData, body.minSnowValue)

  const pointsToClear = pointsWithinPolygon(significantPoints, tinMap)

  return pointsToClear
}

const loadSignificantPointsFromFile = () => {
  const rawdata = fs.readFileSync(SIGNIFICANT_POINTS_PATH)
  const points = JSON.parse(rawdata)

  return points
}

const generateSignificantPoints = async (body) => {
  const significantPoints = prepareSignificantPoints(body)
  fs.writeFileSync(SIGNIFICANT_POINTS_PATH, JSON.stringify(significantPoints))

  const weatherData = await loadWeatherForecast()
  const tinMap = generateTinForWeather(weatherData, body.minSnowValue)
  const pointsToClear = pointsWithinPolygon(significantPoints, tinMap)

  return {
    ...pointsToClear,
    features: pointsToClear.features.slice(0, AMOUNT_OF_POINTS),
  }
  // JSON.stringify(SIGNIFICANT_POINTS))
}

module.exports = {
  getPointsToClear,
  generateSignificantPoints,
}
