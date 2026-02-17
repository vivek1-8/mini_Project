import React, { useEffect, useState } from "react";
import axios from "axios";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// simple cn helper
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ---------------- TAB COMPONENTS (JSX VERSION) ----------------
const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("mt-2", className)}
    {...props}
  />
));

// ------------------- MAIN APP (AXIOS + TABS) -------------------
export default function App() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  // Fetch Users
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Fetch Posts
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => setPosts(res.data.slice(0, 5))) // show 5 only
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        {/* USERS */}
        <TabsContent value="users">
          <h2 className="text-xl font-bold mb-2">Users Data</h2>
          {users.map((u) => (
            <div key={u.id} className="p-3 border rounded mb-2">
              <p><strong>Name:</strong> {u.name}</p>
              <p><strong>Email:</strong> {u.email}</p>
            </div>
          ))}
        </TabsContent>

        {/* POSTS */}
        <TabsContent value="posts">
          <h2 className="text-xl font-bold mb-2">Posts Data</h2>
          {posts.map((p) => (
            <div key={p.id} className="p-3 border rounded mb-2">
              <p><strong>Title:</strong> {p.title}</p>
              <p>{p.body}</p>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
