const sizes = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl"
}

export function Avatar({
  size = "md",
  src,
  alt = "",
  className = "",
  children,
  ...props
}) {

  const sizeClass = sizes[size] || sizes.md

  return (
    <div
      className={`
        ${sizeClass}
        rounded-full
        bg-gradient-to-br from-lime-500 to-lime-600
        flex items-center justify-center
        text-white font-medium
        overflow-hidden
        ${className}
      `}
      {...props}
    >

      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        children
      )}

    </div>
  )
}
