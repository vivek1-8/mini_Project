import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('YOUR_API_ENDPOINT');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props}>
      {data ? JSON.stringify(data) : 'Loading...'}
    </div>
  );
}

export { Skeleton };
