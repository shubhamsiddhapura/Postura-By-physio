"use client";

import { Check, ChevronDown } from "lucide-react";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";

export type ModernSelectOption<T extends string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type ModernSelectProps<T extends string> = {
  id?: string;
  name?: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<ModernSelectOption<T>>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
};

export function ModernSelect<T extends string>({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required,
  disabled,
  className,
  buttonClassName,
  menuClassName,
}: ModernSelectProps<T>) {
  const reactId = useId();
  const selectId = id ?? `modern-select-${reactId}`;
  const listboxId = `${selectId}-listbox`;
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const selectedIndex = useMemo(
    () => options.findIndex((opt) => opt.value === value),
    [options, value],
  );

  const visibleLabel = selectedOption?.label ?? "";
  const isPlaceholder = value === ("" as T) || !selectedOption;

  const focusButton = () => {
    window.requestAnimationFrame(() => btnRef.current?.focus());
  };

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const openMenu = (opts?: { focusSelected?: boolean }) => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(() => {
      if (opts?.focusSelected && selectedIndex >= 0) return selectedIndex;
      const firstEnabled = options.findIndex((o) => !o.disabled);
      return firstEnabled;
    });
  };

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    onChange(opt.value);
    close();
    focusButton();
  };

  const moveActive = (delta: number) => {
    if (options.length === 0) return;
    let idx = activeIndex;
    for (let step = 0; step < options.length; step += 1) {
      idx = (idx + delta + options.length) % options.length;
      if (!options[idx]?.disabled) {
        setActiveIndex(idx);
        return;
      }
    }
  };

  useEffect(() => {
    if (!open) return;

    const onDocPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      close();
    };

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        focusButton();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveActive(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveActive(-1);
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        const firstEnabled = options.findIndex((o) => !o.disabled);
        setActiveIndex(firstEnabled);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        const lastEnabled = [...options].reverse().findIndex((o) => !o.disabled);
        setActiveIndex(lastEnabled >= 0 ? options.length - 1 - lastEnabled : -1);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (activeIndex >= 0) commit(activeIndex);
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onDocKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onDocKeyDown);
    };
  }, [activeIndex, open, options, selectedIndex]);

  useEffect(() => {
    if (!open) return;
    if (activeIndex < 0) return;
    const el = document.getElementById(`${selectId}-option-${activeIndex}`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, selectId]);

  return (
    <div className={cn("relative", className)}>
      {/* Hidden input keeps native form behavior (required, POST, etc.). */}
      {name ? (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          className="sr-only"
          name={name}
          value={value}
          required={required}
          readOnly
        />
      ) : null}

      <button
        ref={btnRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => (open ? close() : openMenu({ focusSelected: true }))}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (!open) openMenu({ focusSelected: true });
            else moveActive(1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (!open) openMenu({ focusSelected: true });
            else moveActive(-1);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            if (!open) openMenu({ focusSelected: true });
            else if (activeIndex >= 0) commit(activeIndex);
          }
        }}
        className={cn(
          "h-11 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none transition",
          "text-gray-800 placeholder:text-gray-400 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/15",
          "disabled:cursor-not-allowed disabled:opacity-60",
          "flex items-center justify-between gap-3 pr-11",
          isPlaceholder && "text-gray-400",
          buttonClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {isPlaceholder ? placeholder : visibleLabel}
        </span>
        <ChevronDown
          className={cn(
            "absolute right-3 h-4 w-4 text-gray-500 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          ref={menuRef}
          role="listbox"
          id={listboxId}
          aria-labelledby={selectId}
          className={cn(
            "absolute left-0 right-0 z-[60] mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.12)]",
            "max-h-64 overflow-y-auto p-1",
            menuClassName,
          )}
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isActive = idx === activeIndex;
            return (
              <div
                key={opt.value}
                id={`${selectId}-option-${idx}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commit(idx)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm",
                  "outline-none transition",
                  opt.disabled && "cursor-not-allowed opacity-50",
                  isActive && "bg-primary/10 text-primary",
                  !isActive && "text-gray-800 hover:bg-gray-50",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

