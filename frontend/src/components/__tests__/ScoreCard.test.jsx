import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ScoreCard from "../ScoreCard";

const mockResult = {
  atsScore: 78,
  keywordScore: 80,
  semanticScore: 65,
  sectionScore: 85,
  formatScore: 90,
};

describe("ScoreCard", () => {
  test("renders the overall ATS score", () => {
    render(<ScoreCard result={mockResult} />);
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("ATS Score")).toBeInTheDocument();
  });

  test("renders all four breakdown metrics with correct values", () => {
    render(<ScoreCard result={mockResult} />);
    expect(screen.getByText("Keyword Match")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("Semantic Relevance")).toBeInTheDocument();
    expect(screen.getByText("65%")).toBeInTheDocument();
    expect(screen.getByText("Section Coverage")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Format Quality")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  test("renders a low score without crashing", () => {
    render(
      <ScoreCard
        result={{
          atsScore: 12,
          keywordScore: 10,
          semanticScore: 5,
          sectionScore: 20,
          formatScore: 15,
        }}
      />
    );
    expect(screen.getByText("12")).toBeInTheDocument();
  });
});
