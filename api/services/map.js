const fs = require('fs')
const { tin, pointsWithinPolygon } = require('@turf/turf')
const { MIN_SNOW_VALUE, SIGNIFICANT_POINTS_PATH } = require('./constants')
const { SIGNIFICANT_POINTS } = require('./mock')
const { loadWeatherForecast } = require('./weather')
const { storeGeoJSON } = require('./helper')

const generateTinForWeather = (weatherData) => {
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

  console.log('tinMap', tinMap.features.length)
  return {
    type: 'FeatureCollection',
    features: tinMap.features.filter(
      (polygon) =>
        (polygon.properties.a + polygon.properties.b + polygon.properties.c) /
          3 >
        MIN_SNOW_VALUE
    ),
  }
}

const getPointsToClear = async () => {
  const weatherData = await loadWeatherForecast()

  const significantPoints = loadSignificantPointsFromFile()
  const tinMap = generateTinForWeather(weatherData)

  console.log('tinMap', tinMap.features.length)

  const pointsToClear = pointsWithinPolygon(significantPoints, tinMap)

  return pointsToClear
}

const loadSignificantPointsFromFile = () => {
  const rawdata = fs.readFileSync(SIGNIFICANT_POINTS_PATH)
  const points = JSON.parse(rawdata)

  return points
}

const generateSignificantPoints = () => {
  //TODO: finish this
  fs.writeFileSync(SIGNIFICANT_POINTS_PATH, JSON.stringify(SIGNIFICANT_POINTS))
}

module.exports = {
  getPointsToClear,
  generateSignificantPoints,
}
