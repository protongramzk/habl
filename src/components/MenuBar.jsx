// src/components/MenuBar.jsx
import { createSignal, Show, For } from "solid-js";
import { X } from "lucide-solid";

/**
 * Agnostic dropdown menu component (Shadcn UI style)
 * 
 * @param {Object} props
 * @param {Array} props.items - Menu items: [{ label, action, variant? }, ...]
 * @param {Function} props.trigger - Render function for trigger button
 * @param {String} props.align - "left" | "right" (default: "right")
 * @param {String} props.className - Additional classes for container
 * 
 * @example
 * <MenuBar
 *   items={[
 *     { label: "Edit", action: handleEdit },
 *     { label: "Delete", action: handleDelete, variant: "destructive" }
 *   ]}
 *   trigger={(open) => <button onClick={open}>{<MoreVertical />}</button>}
 * />
 */
export default function MenuBar(props) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  const handleTrigger = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const align = props.align || "right";

    setPosition({
      top: `${rect.bottom + 8}px`,
      left: align === "right" 
        ? `${rect.right - 160}px` 
        : `${rect.left}px`,
    });

    setIsOpen(true);
  };

  const handleItemClick = async (action) => {
    try {
      await action();
    } catch (err) {
      console.error("Menu action failed:", err);
    } finally {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Close on escape key
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <div class={`relative ${props.className || ""}`}>
      {/* Trigger Button */}
      {props.trigger(handleTrigger)}

      {/* Backdrop - Close menu on click */}
      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-40"
          onClick={handleClose}
          onKeyDown={handleKeyDown}
          role="presentation"
        />
      </Show>

      {/* Dropdown Menu */}
      <Show when={isOpen()}>
        <div
          class="fixed z-50 min-w-[160px] overflow-hidden rounded-md border border-neutral-700 bg-neutral-900 shadow-md"
          style={{
            top: position().top,
            left: position().left,
          }}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-trigger"
        >
          <div class="py-1">
            <For each={props.items}>
              {(item, idx) => (
                <>
                  {/* Divider */}
                  <Show when={item.divider}>
                    <div class="my-1 h-px bg-neutral-800" role="none" />
                  </Show>

                  {/* Menu Item */}
                  <Show when={!item.divider}>
                    <button
                      onClick={() => handleItemClick(item.action)}
                      class={`w-full px-3 py-2 text-left text-sm font-medium transition-colors flex items-center gap-2 ${
                        item.variant === "destructive"
                          ? "text-red-400 hover:bg-red-900/20"
                          : "text-neutral-300 hover:bg-neutral-800/50"
                      }`}
                      role="menuitem"
                    >
                      <Show when={item.icon}>
                        {item.icon}
                      </Show>
                      {item.label}
                    </button>
                  </Show>
                </>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
