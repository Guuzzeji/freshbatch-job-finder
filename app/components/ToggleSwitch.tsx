"use client";

import { useState } from "react";

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  id?: string;
}

export default function ToggleSwitch({ defaultChecked = false, onChange, id }: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    const next = !checked;
    setChecked(next);
    onChange?.(next);
  };

  return (
    <label
      className="relative inline-block h-[22px] w-[38px] shrink-0 cursor-pointer"
      id={id}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="absolute h-0 w-0 opacity-0"
      />
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? "bg-[color:var(--caramel)]" : "bg-[color:var(--border-light)]"}`}
      />
      <div
        className={`absolute top-[3px] left-[3px] h-4 w-4 rounded-full bg-white transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </label>
  );
}
