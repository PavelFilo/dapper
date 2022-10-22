import { CallAPI } from './utils'

interface IGenerateRoutesInput {
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
