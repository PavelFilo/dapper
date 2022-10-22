const DEPO_LAT = 48.152778
const DEPO_LON = 17.127123

const MIN_SNOW_VALUE = 0.000001

const SIGNIFICANT_POINTS_PATH = './data/significantPoints.json'

const DEFAULT_WEIGHTS = {
  class: 5,
  isTrolley: 2,
  isCriticalPT: 5,
}

module.exports = {
  DEPO_LAT,
  DEPO_LON,
  MIN_SNOW_VALUE,
  SIGNIFICANT_POINTS_PATH,
  DEFAULT_WEIGHTS,
}
