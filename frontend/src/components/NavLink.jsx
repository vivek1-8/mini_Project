import React, { forwardRef } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";

// simple cn function
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ---------------- NavLink Component ----------------
const NavLink = forwardRef(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

// ---------------- Main App Component with Axios ----------------
export default function App() {
  const handleClick = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/posts/1");
      const data = await res.json();
      alert("Fetched title: " + data.title);
    } catch (err) {
      alert("Error fetching data!");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">NavLink + Axios Example</h1>

      <nav className="flex space-x-4 mb-6">
        <NavLink
          to="/home"
          className="px-3 py-1 rounded"
          activeClassName="bg-blue-500 text-white"
          pendingClassName="bg-gray-300"
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className="px-3 py-1 rounded"
          activeClassName="bg-blue-500 text-white"
        >
          About
        </NavLink>
      </nav>

      <button
        onClick={handleClick}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Fetch Data
      </button>
    </div>
  );
}
