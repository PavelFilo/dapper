const { lineOverlap, collect, pointsWithinPolygon } = require('@turf/turf')
const fs = require('fs')
const { DEFAULT_WEIGHTS, LAYER_PROPERTIES } = require('./constants')
const { data: pasportData } = require('../data/pasport')
const { average } = require('./helper')

const tileHasData = (properties) =>
  Object.keys(properties).reduce((a, c) => a + (properties[c] || 0), 0) > 0

const loadSourceMap = () => {
  const rawStreets = fs.readFileSync('./data/cesty.geojson')
  const streets = JSON.parse(rawStreets)
  streets.features = streets.features.map((feature, index) => ({
    ...feature,
    properties: { ...feature.properties, id: index },
  }))

  return streets
}

const loadJsonFromFile = (path) => {
  const raw = fs.readFileSync(path)
  return JSON.parse(raw)
}

const loadSchoolData = (grid) => {
  const schools = loadJsonFromFile('./data/schools.geojson')

  const sourceProperty = 'school'
  const targetProperty = 'schoolsCount'

  return collectData(grid, schools, sourceProperty, targetProperty)
}

const loadHospitalData = (grid) => {
  const schools = loadJsonFromFile('./data/hospitals.geojson')

  const sourceProperty = 'hospital'
  const targetProperty = 'hospitalsCount'

  return collectData(grid, schools, sourceProperty, targetProperty)
}

const loadPoliceData = (grid) => {
  const schools = loadJsonFromFile('./data/police.geojson')

  const sourceProperty = 'police'
  const targetProperty = 'policeCount'

  return collectData(grid, schools, sourceProperty, targetProperty)
}

const loadFireDepData = (grid) => {
  const schools = loadJsonFromFile('./data/fireDepartments.geojson')

  const sourceProperty = 'fire'
  const targetProperty = 'fireCount'

  return collectData(grid, schools, sourceProperty, targetProperty)
}

const loadUniversityData = (grid) => {
  const schools = loadJsonFromFile('./data/highSchools.geojson')

  const sourceProperty = 'highSchool'
  const targetProperty = 'highSchoolCount'

  return collectData(grid, schools, sourceProperty, targetProperty)
}

const collectData = (grid, schools, sourceProperty, targetProperty) => {
  const collected = collect(grid, schools, sourceProperty, targetProperty)
  collected.features = collected.features.map((feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      [targetProperty]: average(feature.properties[targetProperty]),
    },
  }))

  return collected
}

const combinePointsMap = (targetMap) => {
  const grid = loadJsonFromFile('./data/grid.geojson')

  let collected = loadSchoolData(grid)
  collected = loadHospitalData(collected)
  collected = loadPoliceData(collected)
  collected = loadFireDepData(collected)
  collected = loadUniversityData(collected)

  const streetPoints = {
    type: 'FeatureCollection',
    features: targetMap.features.flatMap((feature, index) =>
      feature.geometry.coordinates[0].map((coordinate) => ({
        type: 'Feature',
        properties: { streetIndex: index },
        geometry: {
          type: 'Point',
          coordinates: coordinate,
        },
      }))
    ),
  }

  for (let i = 0; i < collected.features.length; i++) {
    const tile = collected.features[i]

    if (tileHasData(tile.properties)) {
      const pointsInGridTile = pointsWithinPolygon(streetPoints, tile)

      for (let j = 0; j < pointsInGridTile.features.length; j++) {
        const feature = pointsInGridTile.features[j]

        targetMap.features[feature.properties.streetIndex].properties = {
          ...targetMap.features[feature.properties.streetIndex].properties,
          [LAYER_PROPERTIES.IS_SCHOOL_NEARBY]: tile.properties.schoolsCount,
          [LAYER_PROPERTIES.IS_HOSPITAL_NEARBY]: tile.properties.hospitalsCount,
          [LAYER_PROPERTIES.IS_POLICE_NEARBY]: tile.properties.policeCount,
          [LAYER_PROPERTIES.IS_FIRE_DEP_NEARBY]: tile.properties.fireCount,
          [LAYER_PROPERTIES.IS_UNIVERSITY_NEARBY]:
            tile.properties.highSchoolCount,
        }
      }
    }
  }
}

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
      properties: street.properties,
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

  const rawCriticalMHD = fs.readFileSync('./data/kritikalMhd.geojson')
  const criticalMHD = JSON.parse(rawCriticalMHD)

  combineLinesMap(criticalMHD, map, LAYER_PROPERTIES.IS_CRITICAL_PT, () => true)
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

  combinePointsMap(map)

  storeFinalMap(map)

  return map
}

const prepareSignificantPoints = ({
  weights,
  preGenerateSourceMap,
  threshold,
}) => {
  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights }

  const map = preGenerateSourceMap
    ? generateAndStoreSourceMap()
    : loadFinalMap()

  map.features = map.features
    .map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        score: computeScore(feature.properties, finalWeights),
      },
    }))
    .filter(({ properties }) => properties.score > (threshold || 1))
    .sort((a, b) => b.properties.score - a.properties.score)

  const points = getPointsFromSignificantStreets(map)

  return points
}

module.exports = { prepareSignificantPoints }
