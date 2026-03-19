// src/components/Button.jsx
import { splitProps } from "solid-js";

/**
 * Reusable Button Component (Shadcn UI style)
 * 
 * @param {Object} props
 * @param {String} props.variant - "default" | "primary" | "secondary" | "ghost" | "outline" | "destructive"
 * @param {String} props.size - "sm" | "md" | "lg" | "icon"
 * @param {Boolean} props.disabled - Disable button
 * @param {Boolean} props.loading - Show loading state
 * @param {Boolean} props.fullWidth - 100% width
 * @param {String} props.className - Additional classes
 * @param {Function} props.onClick - Click handler
 * @param {String} props.type - "button" | "submit" | "reset"
 * @param {String} props.title - Tooltip text
 * @param {String} props.ariaLabel - Accessibility label
 * @param {Component} props.leftIcon - Icon on left
 * @param {Component} props.rightIcon - Icon on right
 * 
 * @example
 * <Button variant="primary" size="md">Save</Button>
 * <Button variant="destructive" size="sm">Delete</Button>
 * <Button variant="ghost" size="icon"><Edit /></Button>
 * <Button loading>Saving...</Button>
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

  // Variant styles
  const variantStyles = {
    default:
      "bg-neutral-800 text-neutral-50 hover:bg-neutral-700 border border-neutral-700",
    primary:
      "bg-emerald-600 text-neutral-50 hover:bg-emerald-500 border border-emerald-600",
    secondary:
      "bg-neutral-700 text-neutral-50 hover:bg-neutral-600 border border-neutral-700",
    ghost:
      "text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800/50 border border-transparent",
    outline:
      "border border-neutral-700 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-50",
    destructive:
      "bg-red-900/20 border border-red-700/50 text-red-400 hover:bg-red-900/30",
  };

  // Size styles
  const sizeStyles = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-6 text-base",
    icon: "h-9 w-9 p-0",
  };

  // Get styles
  const variant = local.variant || "default";
  const size = local.size || "md";
  const baseClass =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variantClass = variantStyles[variant] || variantStyles.default;
  const sizeClass = sizeStyles[size] || sizeStyles.md;

  // Gap for icon + text
  const hasIcon = local.leftIcon || local.rightIcon;
  const gapClass = hasIcon && local.children && size !== "icon" ? "gap-2" : "";

  // Full width class
  const fullWidthClass = local.fullWidth ? "w-full" : "";

  // Final className
  const finalClassName = `${baseClass} ${variantClass} ${sizeClass} ${gapClass} ${fullWidthClass} ${local.className || ""}`;

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
      {/* Left Icon */}
      {local.leftIcon && <span class="flex-shrink-0">{local.leftIcon}</span>}

      {/* Text Content */}
      {local.children && size !== "icon" && (
        <span class="truncate">{local.children}</span>
      )}

      {/* Right Icon */}
      {local.rightIcon && <span class="flex-shrink-0">{local.rightIcon}</span>}
    </button>
  );
}
