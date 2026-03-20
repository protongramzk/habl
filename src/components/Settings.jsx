export function SettingsLayout({ children }) {
  return (
    <div className="bg-white dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export function SettingsHeader({ title, description }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  )
}

export function SettingsGrid({ children }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {children}
    </div>
  )
}

export function SettingsSidebar({ children }) {
  return (
    <div className="lg:col-span-1">
      <nav className="space-y-1">
        {children}
      </nav>
    </div>
  )
}

export function SettingsNavItem({ active = false, icon, children }) {

  const base =
    "group flex items-center px-3 py-2 text-sm font-medium rounded-md"

  const activeStyle =
    "bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300"

  const normalStyle =
    "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"

  return (
    <a href="#" className={`${base} ${active ? activeStyle : normalStyle}`}>
      {icon}
      {children}
    </a>
  )
}

export function SettingsMain({ children }) {
  return (
    <div className="lg:col-span-2">
      {children}
    </div>
  )
}

export function SettingsSection({ title, children }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        {title}
      </h2>
      {children}
    </div>
  )
}
