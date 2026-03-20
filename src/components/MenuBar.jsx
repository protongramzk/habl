import { createSignal, Show, For } from "solid-js";

/**
 * Agnostic dropdown menu component (ClawStorm style)
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
      if (action) await action();
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div class={`relative ${props.className || ""}`}>
      {props.trigger(handleTrigger)}

      <Show when={isOpen()}>
        <div
          class="fixed inset-0 z-40"
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
        />
        <div
          class="fixed z-50 min-w-[160px] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl"
          style={{
            top: position().top,
            left: position().left,
          }}
        >
          <div class="py-1">
            <For each={props.items}>
              {(item) => (
                <Show when={!item.divider} fallback={<div class="my-1 h-px bg-zinc-800" />}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleItemClick(item.action); }}
                    class={`w-full px-4 py-2 text-left text-sm font-bold transition-colors flex items-center gap-3 ${
                      item.variant === "destructive"
                        ? "text-red-500 hover:bg-red-950/30"
                        : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </Show>
              )}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
