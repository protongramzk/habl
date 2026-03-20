import { splitProps } from "solid-js";

/**
 * Reusable Button Component (ClawStorm style)
 */
export default function Button(props) {
  const [local, rest] = splitProps(props, [
    "variant",
    "size",
    "disabled",
    "loading",
    "fullWidth",
    "className",
    "onClick",
    "type",
    "title",
    "ariaLabel",
    "leftIcon",
    "rightIcon",
    "children",
  ]);

  const variantStyles = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "nav-icon-btn",
    outline: "btn-secondary border-zinc-700",
    destructive: "bg-red-900/20 border border-red-700/50 text-red-400 hover:bg-red-900/30",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    icon: "h-10 w-10 p-0",
  };

  const variant = local.variant || "primary";
  const size = local.size || "md";
  const baseClass = "btn transition-all active:scale-95";

  const variantClass = variantStyles[variant] || "btn-primary";
  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const fullWidthClass = local.fullWidth ? "w-full" : "";

  const finalClassName = `${baseClass} ${variantClass} ${sizeClass} ${fullWidthClass} ${local.className || ""}`;
  const isDisabled = local.disabled || local.loading;

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (local.onClick) {
      local.onClick(e);
    }
  };

  return (
    <button
      type={local.type || "button"}
      class={finalClassName}
      disabled={isDisabled}
      onClick={handleClick}
      title={local.title}
      aria-label={local.ariaLabel}
      {...rest}
    >
      {local.leftIcon && <span class="flex-shrink-0">{local.leftIcon}</span>}
      {local.children && size !== "icon" && (
        <span class="truncate">{local.children}</span>
      )}
      {local.rightIcon && <span class="flex-shrink-0">{local.rightIcon}</span>}
    </button>
  );
}
