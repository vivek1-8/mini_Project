import React, { useEffect, useState } from "react";
import axios from "axios";
import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Circle } from "lucide-react";

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarPortal = MenubarPrimitive.Portal;
const MenubarSub = MenubarPrimitive.Sub;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;

const Menubar = React.forwardRef(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Root
      ref={ref}
      className={`flex h-10 items-center space-x-1 rounded-md border bg-background p-1 ${className}`}
      {...props}
    />
  )
);
Menubar.displayName = "Menubar";

const MenubarTrigger = React.forwardRef(
  ({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger
      ref={ref}
      className={`flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none data-[state=open]:bg-accent data-[state=open]:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
      {...props}
    />
  )
);
MenubarTrigger.displayName = "MenubarTrigger";

// Other components remain unchanged...

const MenubarShortcut = ({ className, ...props }) => {
  return <span className={`ml-auto text-xs tracking-widest text-muted-foreground ${className}`} {...props} />;
};
MenubarShortcut.displayName = "MenubarShortcut";

const MyComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("YOUR_API_ENDPOINT");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Menubar>
      <MenubarTrigger>Menu</MenubarTrigger>
      {/* Render your menu items using the fetched data */}
      {data.map(item => (
        <MenubarItem key={item.id}>{item.name}</MenubarItem>
      ))}
    </Menubar>
  );
};

export default MyComponent;
