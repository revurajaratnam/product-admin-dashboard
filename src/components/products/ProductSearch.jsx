"use client";

import { useEffect, useState } from "react";
import Input from "../common/Input";
import useDebounce from "../../hooks/useDebounce";

export default function ProductSearch({ value, onChange }) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, 400);

  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (debounced !== value) onChange(debounced);
  }, [debounced]);

  return (
    <div className="w-full sm:max-w-xs">
      <Input
        id="product-search"
        placeholder="Search products..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Search products"
      />
    </div>
  );
}
