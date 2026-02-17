import React, { useState, useEffect } from "react";
import axios from "axios";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardContent = React.forwardRef(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
      try {
        const response = await axios.get("YOUR_API_ENDPOINT_HERE");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    return (
      <HoverCardPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={`z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ${className}`}
        {...props}
      >
        {data ? <div>{JSON.stringify(data)}</div> : <div>Loading...</div>}
      </HoverCardPrimitive.Content>
    );
  }
);
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardTrigger, HoverCardContent };
