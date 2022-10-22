const { default: fetch } = require('node-fetch')
const { DEPO_LAT, DEPO_LON } = require('./constants')
const { getPointsToClear } = require('./map')
const polyline = require('@mapbox/polyline')
// const { SIGNIFICANT_POINTS } = require('./mock')

const createVehiclesObject = (numberOfVehicles) =>
  Array(numberOfVehicles)
    .fill(0)
    .map((_, index) => ({
      id: index + 1,
      profile: 'driving-car',
      start: [DEPO_LON, DEPO_LAT],
      end: [DEPO_LON, DEPO_LAT],
    }))

const createJobsObject = async () => {
  const points = await getPointsToClear()
  return points.features.map((point, index) => ({
    id: index + 1,
    location: point.geometry.coordinates,
  }))
}

const getRouting = async (numberOfVehicles) => {
  const jobs = await createJobsObject()
  const body = {
    jobs,
    vehicles: createVehiclesObject(numberOfVehicles),
    options: { g: true },
  }

  console.log('body', body)

  const request = await fetch('https://api.openrouteservice.org/optimization', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.ROUTE_SERVICE_TOKEN,
    },
    body: JSON.stringify(body),
  })

  const response = await request.json()
  //   polyline.decode('cxl_cBqwvnS|Dy@ogFyxmAf`IsnA|CjFzCsHluD_k@hi@ljL', 6);
  return {
    ...response,
    routes: response.routes.map((route) => ({
      ...route,
      geometry: polyline.decode(route.geometry, 6),
    })),
  }
}

module.exports = { getRouting }