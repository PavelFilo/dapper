import { DEPO_LAT, DEPO_LON } from '../constants'
import { CallAPI } from './utils'

interface IGenerateRoutesInput {
  /**
   * Count of vehicles
   **/
  vehiclesCount: number
}

interface IGenerateMapInput {
  /**
   * weights of layers
   **/
  weights: { class: number; isTrolley: number }
  threshold: number
  preGenerateSourceMap?: boolean
}

export const generateRoutes = async (input: IGenerateRoutesInput) => {
  return CallAPI({
    body: {
      depos: [{ lat: DEPO_LAT, lon: DEPO_LON, count: input.vehiclesCount }],
    },
    endpoint: 'generate-routes',
  })
}

export const generateMap = async ({
  weights,
  threshold,
  preGenerateSourceMap,
}: IGenerateMapInput) => {
  return CallAPI({
    endpoint: 'pregenerate-map',
    body: {
      weights,
      threshold,
      preGenerateSourceMap,
    },
  })
}

export const weatherForecast = async () => {
  return CallAPI({
    method: 'GET',
    endpoint: 'weather-forecast',
  })
}
