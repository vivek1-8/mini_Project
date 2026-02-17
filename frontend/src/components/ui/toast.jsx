import React, { useState } from "react";
import axios from "axios";

export default function ToastExample() {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
      setToastMessage("Data fetched: " + res.data.title);
      setShowToast(true);
    } catch (err) {
      setToastMessage("Error fetching data!");
      setShowToast(true);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Fetch Data
      </button>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg">
          {toastMessage}
          <button
            className="ml-4 text-red-400"
            onClick={() => setShowToast(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
