import React, { useState } from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";

// Simple cn function
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ---------------- Toggle Variants Function ----------------
const toggleVariants = ({ variant, size }) => {
  let base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-blue-500 data-[state=on]:text-white";

  if (variant === "outline")
    base += " border border-gray-300 bg-transparent hover:bg-blue-100 hover:text-blue-700";

  if (size === "sm") base += " h-9 px-2.5";
  if (size === "lg") base += " h-11 px-5";
  if (!size) base += " h-10 px-3"; // default

  return base;
};

// ---------------- Toggle Component ----------------
const Toggle = React.forwardRef(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size }), className)}
    {...props}
  />
));

Toggle.displayName = "Toggle";

// ---------------- Main App with Axios Fetch ----------------
export default function App() {
  const [state, setState] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Toggle + Axios Fetch Example</h1>

      <Toggle
        className="mb-4"
        pressed={state}
        onPressedChange={(pressed) => {
          setState(pressed);
          fetchData();
        }}
      >
        {state ? "ON" : "OFF"}
      </Toggle>

      <div className="mt-4 p-4 border rounded bg-gray-50">
        <h2 className="font-semibold mb-2">Fetched Data:</h2>
        {data ? (
          <pre className="text-sm">{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p className="text-gray-500">No data fetched yet</p>
        )}
      </div>
    </div>
  );
}
