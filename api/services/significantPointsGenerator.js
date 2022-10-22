const fs = require('fs')
const { data: sourceMap } = require('../data/pasport')

const getStreetClass = (value) => {
  if (value === 'I') return 2
  if (value === 'II') return 1
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

const getPointsFromSignificantStreets = (streets) => ({
  type: 'FeatureCollection',
  features: streets.features.flatMap((street) =>
    street.geometry.coordinates.map((coords) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coords[0], coords[1]],
      },
    }))
  ),
})

const prepareSignificantPoints = (weights) => {
  const map = loadSourceMap()

  map.features = map.features.filter(({ properties }) => properties.d_class > 1)

  const points = getPointsFromSignificantStreets(map)
  console.log('her')

  return points
}

module.exports = { prepareSignificantPoints }
