import React, { useState, useContext } from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";

// Simple cn function
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Example toggleVariants function (replace with your real one if needed)
const toggleVariants = ({ variant, size }) => {
  let base = "px-3 py-1 rounded border transition-colors";
  if (variant === "destructive") base += " bg-red-500 text-white";
  if (size === "sm") base += " text-sm";
  return base;
};

// ---------------- ToggleGroup Context ----------------
const ToggleGroupContext = React.createContext({
  size: "default",
  variant: "default",
});

// ---------------- ToggleGroup Component ----------------
const ToggleGroup = React.forwardRef(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
));
ToggleGroup.displayName = "ToggleGroup";

// ---------------- ToggleGroupItem Component ----------------
const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

// ---------------- Main App with Axios Fetch ----------------
export default function App() {
  const [selected, setSelected] = useState("option1");
  const [data, setData] = useState(null);

  const fetchData = async (option) => {
    setSelected(option);
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
      <h1 className="text-xl font-bold mb-4">ToggleGroup + Axios Fetch Example</h1>

      <ToggleGroup type="single" value={selected} onValueChange={fetchData}>
        <ToggleGroupItem value="option1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option2">Option 2</ToggleGroupItem>
        <ToggleGroupItem value="option3">Option 3</ToggleGroupItem>
      </ToggleGroup>

      <div className="mt-6 p-4 border rounded bg-gray-50">
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
