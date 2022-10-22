import { CallAPI } from './utils'

interface IGenerateRoutesInput {
  /**
   * Count of vehicles
   **/
  vehiclesCount: number
}

interface IGenerateMapInput {
  /**
   * Count of vehicles
   **/
  vehiclesCount: number
}

export const generateRoutes = async (body: IGenerateRoutesInput) => {
  return CallAPI({
    body,
    endpoint: 'generate-routes',
  })
}
export const generateMap = async (body: IGenerateMapInput) => {
  return CallAPI({
    body,
    endpoint: 'pregenerate-map',
  })
}
