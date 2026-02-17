import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio";
import axios from "axios";
import { useState, useEffect } from "react";

const AspectRatio = AspectRatioPrimitive.Root;

export const useAspectRatioData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get(url)
            .then((response) => setData(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
};

export { AspectRatio };
