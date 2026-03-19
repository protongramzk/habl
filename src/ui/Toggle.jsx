export function ToggleRow({ title, description, children }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      {children}
    </div>
  )
}

export function ToggleSwitch({ enabled = false }) {

  const bg = enabled
    ? "bg-lime-600 dark:bg-lime-500"
    : "bg-gray-300 dark:bg-gray-600"

  const knob = enabled
    ? "translate-x-5"
    : "translate-x-0"

  return (
    <button
      type="button"
      className={`${bg} relative inline-flex h-6 w-11 rounded-full border-2 border-transparent transition-colors`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={`${knob} inline-block h-5 w-5 transform rounded-full bg-white transition`}
      />
    </button>
  )
}
