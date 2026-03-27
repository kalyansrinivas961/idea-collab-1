import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { useUserActivity } from "../useUserActivity";
import socket from "../../api/socket";
import { AuthContext } from "../../context/AuthContext";
import React from "react";

// Mock Socket.io
vi.mock("../../api/socket", () => ({
  default: {
    emit: vi.fn(),
  },
}));

// Mock AuthContext
const mockUser = { _id: "user123" };
const wrapper = ({ children }) => (
  <AuthContext.Provider value={{ user: mockUser }}>
    {children}
  </AuthContext.Provider>
);

describe("useUserActivity hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize as active and broadcast 'active' status", () => {
    const { result } = renderHook(() => useUserActivity(), { wrapper });

    expect(result.current).toBe(true);
    expect(socket.emit).toHaveBeenCalledWith("update_activity_status", {
      userId: mockUser._id,
      status: "active",
    });
  });

  it("should become inactive after the specified timeout", () => {
    const timeout = 1000; // 1 second for testing
    const { result } = renderHook(() => useUserActivity(timeout), { wrapper });

    expect(result.current).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(timeout + 100);
    });

    expect(result.current).toBe(false);
    expect(socket.emit).toHaveBeenCalledWith("update_activity_status", {
      userId: mockUser._id,
      status: "inactive",
    });
  });

  it("should reset the timeout and stay active on user interaction", () => {
    const timeout = 3000;
    const { result } = renderHook(() => useUserActivity(timeout), { wrapper });

    // Advance halfway
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current).toBe(true);

    // Trigger activity
    act(() => {
      window.dispatchEvent(new MouseEvent("mousedown"));
    });

    // Advance another 1500ms (total 3000ms since start)
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Should still be active because mousedown reset the timer
    expect(result.current).toBe(true);

    // Advance past the new timeout
    act(() => {
      vi.advanceTimersByTime(1600);
    });
    expect(result.current).toBe(false);
  });

  it("should become active again if activity is detected while inactive", () => {
    const timeout = 1000;
    const { result } = renderHook(() => useUserActivity(timeout), { wrapper });

    // Go inactive
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(result.current).toBe(false);

    // Reset mock to check for new emit
    vi.clearAllMocks();

    // Trigger activity
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown"));
    });

    expect(result.current).toBe(true);
    expect(socket.emit).toHaveBeenCalledWith("update_activity_status", {
      userId: mockUser._id,
      status: "active",
    });
  });

  it("should broadcast 'inactive' status on unmount", () => {
    const { unmount } = renderHook(() => useUserActivity(), { wrapper });
    
    vi.clearAllMocks();
    unmount();

    expect(socket.emit).toHaveBeenCalledWith("update_activity_status", {
      userId: mockUser._id,
      status: "inactive",
    });
  });
});
