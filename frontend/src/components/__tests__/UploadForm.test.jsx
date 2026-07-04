import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UploadForm from "../UploadForm";

describe("UploadForm", () => {
  let alertSpy;
  let onAnalyze;

  beforeEach(() => {
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    onAnalyze = vi.fn();
  });

  test("renders the drag-and-drop zone and job description textarea", () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    expect(
      screen.getByText(/drag & drop your resume/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste the full job description/i)
    ).toBeInTheDocument();
  });

  test("rejects a non-PDF/DOCX file with an alert", () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    const input = document.getElementById("resume-upload");
    const badFile = new File(["hello"], "resume.txt", { type: "text/plain" });

    fireEvent.change(input, { target: { files: [badFile] } });

    expect(alertSpy).toHaveBeenCalledWith(
      expect.stringContaining("PDF or DOCX")
    );
    expect(onAnalyze).not.toHaveBeenCalled();
  });

  test("accepts a valid PDF file and shows its name", async () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    const input = document.getElementById("resume-upload");
    const goodFile = new File(["%PDF-1.4"], "resume.pdf", {
      type: "application/pdf",
    });

    await userEvent.upload(input, goodFile);

    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  test("blocks submission when no file is attached", () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    const textarea = screen.getByPlaceholderText(/paste the full job description/i);
    fireEvent.change(textarea, {
      target: { value: "A job description that is definitely long enough." },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze resume/i }));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("attach your resume"));
    expect(onAnalyze).not.toHaveBeenCalled();
  });

  test("blocks submission when job description is too short", async () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    const input = document.getElementById("resume-upload");
    const goodFile = new File(["%PDF-1.4"], "resume.pdf", { type: "application/pdf" });
    await userEvent.upload(input, goodFile);

    const textarea = screen.getByPlaceholderText(/paste the full job description/i);
    fireEvent.change(textarea, { target: { value: "too short" } });
    fireEvent.click(screen.getByRole("button", { name: /analyze resume/i }));

    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("Paste a job description"));
    expect(onAnalyze).not.toHaveBeenCalled();
  });

  test("calls onAnalyze with correct data on valid submission", async () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={false} />);
    const input = document.getElementById("resume-upload");
    const goodFile = new File(["%PDF-1.4"], "resume.pdf", { type: "application/pdf" });
    await userEvent.upload(input, goodFile);

    const textarea = screen.getByPlaceholderText(/paste the full job description/i);
    fireEvent.change(textarea, {
      target: { value: "A sufficiently long job description for testing purposes." },
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze resume/i }));

    expect(onAnalyze).toHaveBeenCalledTimes(1);
    const arg = onAnalyze.mock.calls[0][0];
    expect(arg.file.name).toBe("resume.pdf");
    expect(arg.jobDescription).toMatch(/sufficiently long/i);
  });

  test("shows a loading state and disables the button", () => {
    render(<UploadForm onAnalyze={onAnalyze} loading={true} />);
    const button = screen.getByRole("button", { name: /analyzing/i });
    expect(button).toBeDisabled();
  });
});
