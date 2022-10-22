import { useCallback, useState } from 'react'
import { generateMap, generateRoutes } from '../api/endpoints'
import { SplashScreenLoader } from '../components/SplashScreenLoader'
import { Map } from './partials/Map'
import {
  IModificationFormValues,
  Modifications,
} from './partials/Modifications'
import { IRoutesFormValues, Routes } from './partials/Routes'
import { FormikHelpers } from 'formik'

export const Page = () => {
  const [routes, setRoutes] = useState()
  const [significantPoints, setSignificantPoints] = useState()

  const onFetchRoutes = useCallback(
    async (
      { vehiclesCount }: IRoutesFormValues,
      { setSubmitting }: FormikHelpers<IRoutesFormValues>
    ) => {
      setSubmitting(true)
      const res = await generateRoutes({ vehiclesCount })

      if (res.success) {
        setRoutes(res?.content?.routes)
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
        setRoutes(undefined)
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

          <Map routes={routes} significantPoints={significantPoints} />

          <Routes
            hasSignificantPoints={!!significantPoints}
            onFetchRoutes={onFetchRoutes}
          />
        </div>
      )}
    </>
  )
}
