const { lineOverlap } = require('@turf/turf')
const fs = require('fs')
const { DEFAULT_WEIGHTS } = require('./constants')
const { data: pasportData } = require('../data/pasport')

const LAYER_PROPERTIES = {
  IS_TROLLEY: 'isTrolley',
  CLASS: 'class',
}

const loadSourceMap = () => {
  const rawStreets = fs.readFileSync('./data/cesty.geojson')
  const streets = JSON.parse(rawStreets)
  return streets
}

const combinePointsMap = () => {}

const combineLinesMap = (sourceMap, targetMap, propertyName, valueFn) => {
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
          [propertyName]: valueFn(sourceFeature.properties),
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
  let score = 0
  Object.keys(LAYER_PROPERTIES).forEach(
    (property) =>
      (score +=
        (properties?.[LAYER_PROPERTIES[property]] || 0) *
        weights[LAYER_PROPERTIES[property]])
  )
  return score
}

const combineLayers = (map) => {
  const rawdata = fs.readFileSync('./data/trolejbus.geojson')
  const trolejbus = JSON.parse(rawdata)

  combineLinesMap(trolejbus, map, LAYER_PROPERTIES.IS_TROLLEY, () => true)

  combineLinesMap(
    pasportData,
    map,
    LAYER_PROPERTIES.CLASS,
    ({ Trieda_komunikacie }) => {
      if (Trieda_komunikacie === 'I') return 1
      if (Trieda_komunikacie === 'II') return 0.5
      return 0
    }
  )
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
