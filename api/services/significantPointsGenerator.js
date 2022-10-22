const fs = require('fs')
const { data: sourceMap } = require('../data/pasport')
const { DEFAULT_WEIGHTS } = require('./constants')

const getStreetClass = (value) => {
  if (value === 'I') return 1
  if (value === 'II') return 0.5
  return 0
}

const loadSourceMap = () => ({
  type: 'FeatureCollection',
  features: sourceMap.features.map((feature) => ({
    ...feature,
    properties: {
      d_class: getStreetClass(feature.properties.Trieda_komunikacie),
    },
  })),
})

const combinePointsMap = () => {}

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

const computeScore = ({ properties, weights }) => {
  return properties.d_class * weights.dClass
}

const prepareSignificantPoints = (weights) => {
  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights }

  const map = loadSourceMap()

  map.features = map.features.filter(
    ({ properties }) => computeScore(properties, finalWeights) > 1
  )

  const points = getPointsFromSignificantStreets(map)

  return points
}

module.exports = { prepareSignificantPoints }
