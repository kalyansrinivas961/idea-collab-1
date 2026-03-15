import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../LoginPage.jsx";

vi.mock("../../api/client.js", () => ({
  default: {
    post: vi.fn(),
  },
}));

vi.mock("../../context/AuthContext.jsx", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

describe("LoginPage password visibility toggle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

  it("hides password by default and toggles to visible on click", () => {
    setup();
    const pwd = screen.getByLabelText(/password/i).closest("div").querySelector("#login-password");
    expect(pwd).toHaveAttribute("type", "password");
    const toggle = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(toggle);
    expect(pwd).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAccessibleName("Hide password");
    fireEvent.click(toggle);
    expect(pwd).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });
});

