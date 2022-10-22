import { CallAPI } from './utils'

interface IGenerateRoutesInput {
  /**
   * Count of vehicles
   **/
  vehiclesCount: number
}

// interface IGenerateMapInput {
//   /**
//    * Count of vehicles
//    **/
//   vehiclesCount: number
// }

export const generateRoutes = async (body: IGenerateRoutesInput) => {
  return CallAPI({
    body,
    endpoint: 'generate-routes',
  })
}
export const generateMap = async () => {
  return CallAPI({
    endpoint: 'pregenerate-map',
    body: {
      weights: { class: 1, isTrolley: 1 },
      preGenerateSourceMap: true,
    },
  })
}
