export function Form({ children, className = "" }) {
  return (
    <form className={`space-y-6 ${className}`}>
      {children}
    </form>
  )
}

export function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

export function FormInput(props) {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-3
        bg-white dark:bg-gray-700
        border border-gray-300 dark:border-gray-600
        rounded-lg
        focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400
        focus:border-lime-500 dark:focus:border-lime-400
        outline-none transition-colors
        text-gray-900 dark:text-white
        ${props.className || ""}
      `}
    />
  )
}

export function FormTextarea(props) {
  return (
    <textarea
      {...props}
      className={`
        w-full px-4 py-3
        bg-white dark:bg-gray-700
        border border-gray-300 dark:border-gray-600
        rounded-lg resize-none
        focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400
        text-gray-900 dark:text-white
        ${props.className || ""}
      `}
    />
  )
}

export function FormSelect(props) {
  return (
    <select
      {...props}
      className={`
        w-full px-4 py-3
        bg-white dark:bg-gray-700
        border border-gray-300 dark:border-gray-600
        rounded-lg
        focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400
        text-gray-900 dark:text-white
        ${props.className || ""}
      `}
    />
  )
}

export function FormActions({ children }) {
  return (
    <div className="flex justify-end pt-6">
      {children}
    </div>
  )
}

export function FormButton({ variant = "primary", children }) {

  const styles = {
    primary:
      "bg-lime-600 dark:bg-lime-500 text-white hover:bg-lime-700 dark:hover:bg-lime-600",
    secondary:
      "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
  }

  return (
    <button
      className={`
        py-2.5 px-6 rounded-lg text-sm font-medium
        transition-colors
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  )
}
