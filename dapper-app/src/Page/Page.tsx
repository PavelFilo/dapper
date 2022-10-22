import { useCallback, useState } from 'react'
import { generateMap, generateRoutes } from '../api/endpoints'
import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { IRoute, Map } from './partials/Map'
import {
  IModificationFormValues,
  Modifications,
} from './partials/Modifications'
import { IRoutesFormValues, Routes } from './partials/Routes'
import { FormikHelpers } from 'formik'

export const Page = () => {
  const [routeData, setRouteData] = useState<
    { routes: IRoute[]; summary: any } | undefined
  >()
  const [significantPoints, setSignificantPoints] = useState()

  const onFetchRoutes = useCallback(
    async (
      { vehiclesCount }: IRoutesFormValues,
      { setSubmitting }: FormikHelpers<IRoutesFormValues>
    ) => {
      setSubmitting(true)
      const res = await generateRoutes({ vehiclesCount })

      if (res.success) {
        setRouteData(res?.content)
        setSubmitting(false)
      }
    },
    [generateRoutes]
  )

  const onFetchSignificantPoints = useCallback(
    async (
      values: IModificationFormValues,
      { setSubmitting }: FormikHelpers<IModificationFormValues>
    ) => {
      setSubmitting(true)

      const res = await generateMap({
        weights: { class: values.class, isTrolley: values.isTrolley },
        threshold: 1,
      })

      if (res.success) {
        setRouteData(undefined)
        setSignificantPoints(res?.content?.features.slice(0, 40))
        setSubmitting(false)
      }
    },
    [generateMap]
  )

  return (
    <>
      {false ? (
        <SplashScreenLoader />
      ) : (
        <div className="flex w-screen h-screen">
          <Modifications onFetchSignificantPoints={onFetchSignificantPoints} />

          <Map
            routes={routeData?.routes}
            significantPoints={significantPoints}
          />

          <Routes
            routeData={routeData}
            hasSignificantPoints={!!significantPoints}
            onFetchRoutes={onFetchRoutes}
          />
        </div>
      )}
    </>
  )
}
