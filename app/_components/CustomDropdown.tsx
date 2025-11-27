"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
  placeholder: string;
}

export default function CustomDropdown({
  value,
  onChange,
  options,
  placeholder,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    onChange(key);
    setIsOpen(false);
  };

  const selectedLabel = options[value] || placeholder;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full md:w-48 px-4 py-2.5 bg-bg-page border border-border rounded-xl text-sm transition-all cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-brand/20",
          isOpen ? "border-brand ring-2 ring-brand/20" : "hover:border-text-sub"
        )}
      >
        <span
          className={cn(
            "truncate",
            value === "" ? "text-text-sub" : "text-text-main font-medium"
          )}
        >
          {selectedLabel}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-text-sub transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-bg-surface border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100">
          <ul className="py-1 max-h-60 overflow-auto">
            <li
              onClick={() => handleSelect("")}
              className={cn(
                "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors",
                value === ""
                  ? "bg-brand/5 text-brand font-medium"
                  : "text-text-main hover:bg-bg-page"
              )}
            >
              {placeholder}
              {value === "" && <Check size={18} className="text-brand" />}
            </li>
            {Object.entries(options).map(([key, label]) => (
              <li
                key={key}
                onClick={() => handleSelect(key)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors",
                  value === key
                    ? "bg-brand/5 text-brand font-medium"
                    : "text-text-main hover:bg-bg-page"
                )}
              >
                {label}
                {value === key && <Check size={18} className="text-brand" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
