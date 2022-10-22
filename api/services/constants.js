const DEPO_LAT = 48.152778
const DEPO_LON = 17.127123

const MIN_SNOW_VALUE = 0.000001

const SIGNIFICANT_POINTS_PATH = './data/significantPoints.json'

const LAYER_PROPERTIES = {
  IS_TROLLEY: 'isTrolley',
  CLASS: 'class',
  IS_CRITICAL_PT: 'isCriticalPT',
  IS_SCHOOL_NEARBY: 'isSchoolNearby',
  IS_HOSPITAL_NEARBY: 'isHospitalNearby',
  IS_POLICE_NEARBY: 'isPoliceNearby',
  IS_FIRE_DEP_NEARBY: 'isFireDepNearby',
  IS_UNIVERSITY_NEARBY: 'isUniversityNearby',
}

const DEFAULT_WEIGHTS = {
  [LAYER_PROPERTIES.CLASS]: 5,
  [LAYER_PROPERTIES.IS_TROLLEY]: 2,
  [LAYER_PROPERTIES.IS_CRITICAL_PT]: 5,
  [LAYER_PROPERTIES.IS_SCHOOL_NEARBY]: 1,
  [LAYER_PROPERTIES.IS_HOSPITAL_NEARBY]: 1,
  [LAYER_PROPERTIES.IS_POLICE_NEARBY]: 1,
  [LAYER_PROPERTIES.IS_FIRE_DEP_NEARBY]: 1,
  [LAYER_PROPERTIES.IS_UNIVERSITY_NEARBY]: 1,
}

const AMOUNT_OF_POINTS = 40

module.exports = {
  DEPO_LAT,
  DEPO_LON,
  MIN_SNOW_VALUE,
  SIGNIFICANT_POINTS_PATH,
  DEFAULT_WEIGHTS,
  LAYER_PROPERTIES,
  AMOUNT_OF_POINTS,
}
