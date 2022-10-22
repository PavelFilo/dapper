import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers, Field } from 'formik'
import { IRoute } from './Map'
import { VehiclesTable } from './VehiclesTable'
import { Button } from '../../components/Button'

export type TRouteData = { routes: IRoute[]; summary: any } | undefined

interface IVehiclesProps {
  hasSignificantPoints?: boolean
  routeData?: TRouteData

  onFetchRoutes: (
    values: IRoutesFormValues,
    helpers: FormikHelpers<IRoutesFormValues>
  ) => void
}

const routesValidationSchema = Yup.object().shape({
  vehiclesCount: Yup.number().required().min(1).max(3),
})

export type IRoutesFormValues = Yup.InferType<typeof routesValidationSchema>

export const Routes = ({
  hasSignificantPoints,
  routeData,
  onFetchRoutes,
}: IVehiclesProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="z-400 absolute right-4 top-5"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>

      <Sidebar className="px-4 py-5" isOpen={isOpen} side="right">
        <Formik
          validationSchema={routesValidationSchema}
          initialValues={routesValidationSchema.cast({
            vehiclesCount: 1,
          })}
          onSubmit={onFetchRoutes}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="h-full flex flex-col">
              <div className="gap-2 flex-1 flex-col flex items-start">
                <div className="flex w-full justify-end">
                  <button
                    type="button"
                    className="float-right"
                    onClick={() => setIsOpen(false)}
                  >
                    close
                  </button>
                </div>

                <Field name="vehiclesCount">
                  {({ field }: any) => (
                    <Input
                      type="number"
                      label="Number of vehicles"
                      {...field}
                    />
                  )}
                </Field>

                <VehiclesTable routeData={routeData} />
              </div>

              <div className="flex items-start">
                <Button
                  loading={isSubmitting}
                  disabled={!hasSignificantPoints || !isValid || isSubmitting}
                  type="submit"
                >
                  GENERATE ROUTES
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  )
}
