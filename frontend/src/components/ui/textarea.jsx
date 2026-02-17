import React, { useState, useEffect } from "react";
import axios from "axios";

// simple cn function
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ---------------------- TEXTAREA COMPONENT (JSX) ----------------------
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

// ---------------------- MAIN APP (AXIOS + TEXTAREA) ----------------------
export default function App() {
  const [data, setData] = useState([]);
  const [text, setText] = useState("");

  // axios data fetch
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((res) => {
        setData(res.data.slice(0, 5)); // sirf first 5 comments
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">Textarea + Axios Fetch</h1>

      {/* Textarea */}
      <Textarea
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="mb-4"
      />

      {/* API Data */}
      <h2 className="text-lg font-semibold mb-2">Fetched Comments:</h2>
      {data.map((item) => (
        <div key={item.id} className="p-3 mb-2 border rounded">
          <p className="font-medium">{item.email}</p>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
