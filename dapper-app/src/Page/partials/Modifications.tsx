import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'
import { Form, Formik, FormikHelpers, Field } from 'formik'
import * as Yup from 'yup'

interface IModificationsProps {
  onFetchSignificantPoints: (
    values: IModificationFormValues,
    helpers: FormikHelpers<IModificationFormValues>
  ) => void
}

const modificationValidationSchema = Yup.object().shape({
  weightCar: Yup.number().required().min(0).max(1),
  weightTro: Yup.number().required().min(0).max(1),
  weightBla: Yup.number().required().min(0).max(1),
})

export type IModificationFormValues = Yup.InferType<
  typeof modificationValidationSchema
>

export const Modifications = ({
  onFetchSignificantPoints,
}: IModificationsProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className="z-500 absolute left-4 top-5"
        onClick={() => setIsOpen(true)}
      >
        open
      </button>

      <Sidebar className="px-4 py-5" isOpen={isOpen} side="left">
        <Formik
          validationSchema={modificationValidationSchema}
          initialValues={modificationValidationSchema.cast({
            weightCar: 1,
            weightTro: 1,
            weightBla: 1,
          })}
          onSubmit={onFetchSignificantPoints}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="h-full flex flex-col">
              <div className="gap-2 flex-1 flex-col flex items-start">
                <button
                  type="button"
                  className="float-right"
                  onClick={() => setIsOpen(false)}
                >
                  close
                </button>

                <Field name="weightCar">
                  {({ field }: any) => (
                    <Input
                      type="number"
                      label="Weight of car layer"
                      {...field}
                    />
                  )}
                </Field>
                <Field name="weightTro">
                  {({ field }: any) => (
                    <Input
                      type="number"
                      label="Weight of bus layer"
                      {...field}
                    />
                  )}
                </Field>
                <Field name="weightBla">
                  {({ field }: any) => (
                    <Input
                      type="number"
                      label="Weight of bla layer"
                      {...field}
                    />
                  )}
                </Field>
              </div>

              <div className="flex items-start">
                <button disabled={!isValid || isSubmitting} type="submit">
                  GENERTE MAP
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  )
}
