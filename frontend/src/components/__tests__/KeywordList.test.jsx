import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import KeywordList from "../KeywordList";

describe("KeywordList", () => {
  test("renders matched and missing keyword chips", () => {
    render(
      <KeywordList
        matched={["react", "node.js"]}
        missing={["aws", "docker"]}
      />
    );

    expect(screen.getByText("Matched Keywords (2)")).toBeInTheDocument();
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("node.js")).toBeInTheDocument();

    expect(screen.getByText("Missing Keywords (2)")).toBeInTheDocument();
    expect(screen.getByText("aws")).toBeInTheDocument();
    expect(screen.getByText("docker")).toBeInTheDocument();
  });

  test("shows a celebratory message when nothing is missing", () => {
    render(<KeywordList matched={["react"]} missing={[]} />);
    expect(screen.getByText(/no major gaps found/i)).toBeInTheDocument();
  });

  test("shows a fallback message when nothing matched", () => {
    render(<KeywordList matched={[]} missing={["react"]} />);
    expect(screen.getByText(/no keyword matches found/i)).toBeInTheDocument();
  });

  test("defaults to empty arrays when no props are passed", () => {
    render(<KeywordList />);
    expect(screen.getByText("Matched Keywords (0)")).toBeInTheDocument();
    expect(screen.getByText("Missing Keywords (0)")).toBeInTheDocument();
  });
});
