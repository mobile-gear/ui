import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "@/components/Pagination";

describe("Pagination", () => {
  it("does not render when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders page buttons correctly", () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Last")).toBeInTheDocument();
  });

  it("calls onPageChange with correct page on button click", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText("4"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disables First and Prev on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("First")).toBeDisabled();
    expect(screen.getByText("Prev")).toBeDisabled();
  });

  it("disables Next and Last on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByText("Next")).toBeDisabled();
    expect(screen.getByText("Last")).toBeDisabled();
  });

  it("disables Next and Last when isNextDisabled is true", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        isNextDisabled={true}
        onPageChange={vi.fn()}
      />
    );
    expect(screen.getByText("Next")).toBeDisabled();
    expect(screen.getByText("Last")).toBeDisabled();
  });

  it("calls onPageChange(1) when First is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={4} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText("First"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange(totalPages) when Last is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={4} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText("Last"));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it("shows at most 5 page numbers", () => {
    render(
      <Pagination currentPage={5} totalPages={20} onPageChange={vi.fn()} />
    );
    const pageButtons = ["3", "4", "5", "6", "7"];
    pageButtons.forEach((p) => expect(screen.getByText(p)).toBeInTheDocument());
  });

  it("calls onPageChange with currentPage - 1 when Prev is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText("Prev"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByText("Next"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
