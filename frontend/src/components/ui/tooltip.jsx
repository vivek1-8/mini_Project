import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// ----------------- Utility -----------------
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ---------------- Tooltip Components ----------------
export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-white px-3 py-1.5 text-sm text-black shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
);
TooltipContent.displayName = "TooltipContent";

// ---------------- Example Usage ----------------
export const TooltipDemo = () => {
  const [tooltipData, setTooltipData] = React.useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
      const json = await res.json();
      setTooltipData(json.name);
    } catch (err) {
      console.error(err);
      setTooltipData("Error fetching data");
    }
  };

  return (
    <TooltipProvider>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Tooltip + Fetch Example</h1>

        <Tooltip>
          <TooltipTrigger>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Hover me or Click
            </button>
          </TooltipTrigger>

          <TooltipContent sideOffset={6}>
            {tooltipData || "Click button to fetch data"}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
