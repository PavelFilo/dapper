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

export const generateRoutes = async (body: IGenerateRoutesInput) => {
  return CallAPI({
    body,
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
