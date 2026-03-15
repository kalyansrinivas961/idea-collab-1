import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Footer from "../../components/Footer.jsx";
import * as legal from "../../config/legal.js";

describe("Footer", () => {
  it("renders legal links and dynamic year", () => {
    const year = new Date().getFullYear();
    render(
      <BrowserRouter>
        <Footer locale="en" />
      </BrowserRouter>
    );
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /terms of service/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`©\\s+${year}`))).toBeInTheDocument();
  });

  it("supports localization", () => {
    render(
      <BrowserRouter>
        <Footer locale="fr" />
      </BrowserRouter>
    );
    expect(screen.getByRole("link", { name: /conditions d’utilisation/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /politique de confidentialité/i })).toBeInTheDocument();
  });
});

