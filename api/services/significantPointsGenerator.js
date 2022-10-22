const { lineOverlap } = require('@turf/turf')
const fs = require('fs')
const { data: sourceMap } = require('../data/pasport')
const { DEFAULT_WEIGHTS } = require('./constants')
const { storeGeoJSON } = require('./helper')

const LAYER_PROPERTIES = {
  IS_TROLLEY: 'isTrolley',
}

// const getStreetClass = (value) => {
//   if (value === 'I') return 1
//   if (value === 'II') return 0.5
//   return 0
// }

const loadSourceMap = () => {
  const rawStreets = fs.readFileSync('./data/cesty.geojson')
  const streets = JSON.parse(rawStreets)
  return streets
}

const combinePointsMap = () => {}

const combineLinesMap = (sourceMap, targetMap, propertyName, value) => {
  for (let i = 0; i < targetMap.features.length; i++) {
    const targetFeature = targetMap.features[i]

    for (let j = 0; j < sourceMap.features.length; j++) {
      const sourceFeature = sourceMap.features[j]

      const overlap = lineOverlap(targetFeature, sourceFeature, {
        tolerance: 0.005,
      })

      if (overlap.features.length > 0) {
        targetMap.features[i].properties = {
          ...targetMap.features[i].properties,
          [propertyName]: value,
        }
      }
    }
  }
}

const getMiddlePoint = (coordinates) => [
  coordinates[Math.floor(coordinates.length / 2)],
]

const getPointsFromSignificantStreets = (streets) => ({
  type: 'FeatureCollection',
  features: streets.features.flatMap((street) =>
    getMiddlePoint(street.geometry.coordinates[0]).map((coords) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coords[0], coords[1]],
      },
    }))
  ),
})

const computeScore = (properties, weights) => {
  return (properties?.[LAYER_PROPERTIES.IS_TROLLEY] || 0) * weights.isTrolley
}

const combineLayers = (map) => {
  const rawdata = fs.readFileSync('./data/trolejbus.geojson')
  const trolejbus = JSON.parse(rawdata)

  combineLinesMap(trolejbus, map, LAYER_PROPERTIES.IS_TROLLEY, 1)
}

const loadFinalMap = () => {
  const rawdata = fs.readFileSync('./data/final.geojson')
  return JSON.parse(rawdata)
}

const storeFinalMap = (data) => {
  fs.writeFileSync('./data/final.geojson', JSON.stringify(data))
}

const generateAndStoreSourceMap = () => {
  console.log('Pregenerating map')
  const map = loadSourceMap()

  combineLayers(map)

  storeFinalMap(map)

  return map
}

const prepareSignificantPoints = ({ weights, preGenerateSourceMap }) => {
  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights }
  console.log('finalWeights', finalWeights)

  const map = preGenerateSourceMap
    ? generateAndStoreSourceMap()
    : loadFinalMap()

  map.features = map.features.filter(
    ({ properties }) => computeScore(properties, finalWeights) > 1
  )

  const points = getPointsFromSignificantStreets(map)

  return points
}

module.exports = { prepareSignificantPoints }
