import React, { useState, useEffect } from "react";
import axios from "axios";
import { Switch } from "./switch"; // Assuming your Switch component is in a file named Switch.jsx

const SettingsPanel = () => {
  // State for the switch, initialized to false (unchecked)
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  // State for loading, used while fetching/sending data
  const [isLoading, setIsLoading] = useState(false);
  // State for error handling
  const [error, setError] = useState(null);

  const API_URL = "/api/user/settings"; // Replace with your actual API endpoint

  // --- Initial Fetch: Get the current setting from the server ---
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(API_URL);
        // Assuming the response data has a property like 'notificationsEnabled'
        setIsNotificationsEnabled(response.data.notificationsEnabled);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Failed to load settings.");
        // Optional: you might want to disable the switch on load failure
        setIsNotificationsEnabled(false); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // --- Handle Switch Change: Update the server with the new state ---
  const handleSwitchChange = async (checkedState) => {
    // Optimistically update the UI state
    setIsNotificationsEnabled(checkedState); 
    setIsLoading(true);
    setError(null);

    try {
      // Send a POST or PUT request to update the setting
      await axios.post(API_URL, {
        notificationsEnabled: checkedState,
      });
      // Handle successful update (e.g., show a success message)
      console.log(`Notifications state updated to: ${checkedState}`);
    } catch (err) {
      console.error("Failed to update settings:", err);
      setError("Failed to save changes. Please try again.");
      // Rollback the UI state if the update failed
      setIsNotificationsEnabled(!checkedState); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-sm">
      <h3 className="text-lg font-semibold mb-4">User Preferences</h3>
      
      <div className="flex items-center justify-between">
        <label htmlFor="notification-switch" className="text-sm font-medium">
          Enable Notifications
        </label>
        {/* Pass the state and handler to the Radix/Tailwind Switch */}
        <Switch
          id="notification-switch"
          checked={isNotificationsEnabled}
          onCheckedChange={handleSwitchChange}
          disabled={isLoading} // Disable while loading or saving
        />
      </div>

      {isLoading && <p className="text-xs text-gray-500 mt-2">Updating setting...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SettingsPanel;