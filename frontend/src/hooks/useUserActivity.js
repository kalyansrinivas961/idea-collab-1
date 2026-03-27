import { useEffect, useRef, useState, useCallback } from "react";
import socket from "../api/socket";
import { useAuth } from "../context/AuthContext";

/**
 * Custom hook to track user activity and broadcast status via Socket.io.
 * Displays "active" status for 3 minutes after the last user interaction.
 * 
 * @param {number} timeout - Inactivity timeout in milliseconds (default: 3 minutes)
 * @returns {boolean} isActive - Current activity status of the user
 */
export const useUserActivity = (timeout = 3 * 60 * 1000) => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(true);
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const broadcastStatus = useCallback((status) => {
    if (user?._id) {
      socket.emit("update_activity_status", {
        userId: user._id,
        status: status ? "active" : "inactive",
      });
    }
  }, [user?._id]);

  const handleActivity = useCallback(() => {
    const now = Date.now();
    lastActivityRef.current = now;

    if (!isActive) {
      setIsActive(true);
      broadcastStatus(true);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      broadcastStatus(false);
    }, timeout);
  }, [isActive, broadcastStatus, timeout]);

  useEffect(() => {
    // Throttled activity handler to prevent excessive CPU usage
    let throttleTimeout = null;
    const throttledHandleActivity = () => {
      if (!throttleTimeout) {
        handleActivity();
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
        }, 1000); // Only process activity once per second
      }
    };

    const events = ["mousedown", "keydown", "touchstart", "mousemove", "scroll"];
    
    events.forEach((event) => {
      window.addEventListener(event, throttledHandleActivity, { passive: true });
    });

    // Initial broadcast
    broadcastStatus(true);
    
    // Initial timer
    timeoutRef.current = setTimeout(() => {
      setIsActive(false);
      broadcastStatus(false);
    }, timeout);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledHandleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (throttleTimeout) {
        clearTimeout(throttleTimeout);
      }
      // Set to inactive on unmount
      broadcastStatus(false);
    };
  }, [handleActivity, broadcastStatus, timeout]);

  return isActive;
};
