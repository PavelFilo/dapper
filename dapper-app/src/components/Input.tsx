interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, name, ...passingProps }: IInputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-1 text-sm font-medium text-white"
        >
          {label}
        </label>
      )}

      <input
        type="text"
        id={name}
        className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder="Enter weight"
        required
        {...passingProps}
      />
    </div>
  )
}
