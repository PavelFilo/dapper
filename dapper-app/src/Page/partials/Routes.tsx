import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers, Field } from 'formik'

interface IVehiclesProps {
  onFetchRoutes: (
    values: IRoutesFormValues,
    helpers: FormikHelpers<IRoutesFormValues>
  ) => void
}

const routesValidationSchema = Yup.object().shape({
  vehiclesCount: Yup.number().required().min(1).max(3),
})

export type IRoutesFormValues = Yup.InferType<typeof routesValidationSchema>

export const Routes = ({ onFetchRoutes }: IVehiclesProps) => {
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
              </div>

              <div className="flex items-start">
                <button disabled={!isValid || isSubmitting} type="submit">
                  GENERTE ROUTES
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  )
}
