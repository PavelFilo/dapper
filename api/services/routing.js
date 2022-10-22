const { default: fetch } = require('node-fetch')
const { DEPO_LAT, DEPO_LON } = require('./constants')
const { getPointsToClear } = require('./map')
const polyline = require('@mapbox/polyline')

const DEFAULT_DEPO = [
  {
    lat: DEPO_LAT,
    lon: DEPO_LON,
    count: 1,
  },
]

const createVehiclesObject = (depos) =>
  depos
    .flatMap((depo) =>
      Array(depo.count)
        .fill(0)
        .map((_) => ({
          profile: 'driving-car',
          start: [depo.lon, depo.lat],
        }))
    )
    .map((vehicle, index) => ({ ...vehicle, id: index + 1 }))

const createJobsObject = async (body) => {
  const points = await getPointsToClear(body)
  return points.features.map((point, index) => ({
    id: index + 1,
    location: point.geometry.coordinates,
  }))
}

const getRouting = async (input) => {
  const jobs = await createJobsObject(input)
  const body = {
    jobs: jobs.slice(0, 40),
    vehicles: createVehiclesObject(input.depos || DEFAULT_DEPO),
    options: { g: true },
  }

  console.log(body.vehicles)

  const request = await fetch('https://api.openrouteservice.org/optimization', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: process.env.ROUTE_SERVICE_TOKEN,
    },
    body: JSON.stringify(body),
  })

  const response = await request.json()
  console.log('response', response)
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
