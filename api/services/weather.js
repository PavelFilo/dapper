const { default: fetch } = require('node-fetch')

const RADIUS_KM = 5
const LAT = 17.14068
const LON = 48.161324

const loadWeatherForecast = async () => {
  const request = await fetch(
    `https://climathon.iblsoft.com/data/radar-nowcasting/edr/collections/single-layer/radius?coords=POINT(${LAT}%20${LON})&crs=CRS%3A84&within=${RADIUS_KM}&within-units=km`
  )

  const response = await request.json()

  const data = response.domain.axes.t.values.map((time, timeIndex) => ({
    date: time,
    points: response.domain.axes.composite.values.map(
      (coordinates, coordIndex) => ({
        lat: coordinates[1],
        lon: coordinates[0],
        value:
          response.ranges['precipitation-rate_gnd-surf'].values[
            response.domain.axes.composite.values.length * timeIndex +
              coordIndex
          ],
      })
    ),
  }))

  return data
}

module.exports = { loadWeatherForecast }
