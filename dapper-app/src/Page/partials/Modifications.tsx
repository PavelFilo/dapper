import { useState } from 'react'
import { Input } from '../../components/Input'
import { Sidebar } from '../../components/Sidebar'
import { Form, Formik, FormikHelpers, Field } from 'formik'
import Specifition from '../../assets/form-24-regular.svg'
import Close from '../../assets/close-big.svg'

import * as Yup from 'yup'
import { Button } from '../../components/Button'

interface IModificationsProps {
  onFetchSignificantPoints: (
    values: IModificationFormValues,
    helpers: FormikHelpers<IModificationFormValues>
  ) => void
}

const modificationValidationSchema = Yup.object().shape({
  class: Yup.number().required().min(0),
  isTrolley: Yup.number().required().min(0),
  isCriticalPT: Yup.number().required().min(0),
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
        className={`z-500 absolute left-4 top-5 p-2 rounded-3xl transition-opacity bg-dark ${
          isOpen ? 'opacity-0' : 'opacity-1'
        }`}
        onClick={() => setIsOpen(true)}
      >
        <img className="specifition" src={Specifition} alt="" />
      </button>

      <Sidebar className="px-4 py-5" isOpen={isOpen} side="left">
        <Formik
          validationSchema={modificationValidationSchema}
          initialValues={modificationValidationSchema.cast({
            class: 1,
            isTrolley: 1,
            isCriticalPT: 1,
          })}
          onSubmit={onFetchSignificantPoints}
        >
          {({ isValid, isSubmitting }) => (
            <Form className="h-full flex flex-col">
              <div className="flex items-end justify-end pb-3">
                <button
                  type="button"
                  className=" p-1 rounded-3xl "
                  onClick={() => setIsOpen(false)}
                >
                  <img className="close" src={Close} alt="" />
                </button>
              </div>
              <div className="gap-2 flex-1 flex-col flex items-start">
                <Field name="class">
                  {({ field }: any) => (
                    <Input type="number" label="Class of the road" {...field} />
                  )}
                </Field>
                <Field name="isTrolley">
                  {({ field }: any) => (
                    <Input type="number" label="Trolley roads" {...field} />
                  )}
                </Field>
                <Field name="isCriticalPT">
                  {({ field }: any) => (
                    <Input
                      type="number"
                      label="Critical public transport"
                      {...field}
                    />
                  )}
                </Field>
              </div>

              <div className="flex items-center justify-center pb-5">
                <Button
                  loading={isSubmitting}
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  GENERATE NEW MAP
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </>
  )
}
