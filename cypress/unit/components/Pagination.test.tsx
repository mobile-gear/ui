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

  it("renders page buttons correctly", async () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBeGreaterThan(0);
    expect(screen.getByTestId("pagination-first")).toBeInTheDocument();
    expect(screen.getByTestId("pagination-last")).toBeInTheDocument();
  });

  it("calls onPageChange with correct page on button click", async () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    fireEvent.click(pages[3]);
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("disables First and Prev on first page", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-first")).toBeDisabled();
    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
  });

  it("disables Next and Last on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
    expect(screen.getByTestId("pagination-last")).toBeDisabled();
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
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
    expect(screen.getByTestId("pagination-last")).toBeDisabled();
  });

  it("calls onPageChange(1) when First is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={4} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByTestId("pagination-first"));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("calls onPageChange(totalPages) when Last is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={4} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByTestId("pagination-last"));
    expect(onPageChange).toHaveBeenCalledWith(10);
  });

  it("shows at most 5 page numbers", async () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBeLessThanOrEqual(5);
  });

  it("calls onPageChange with currentPage - 1 when Prev is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByTestId("pagination-prev"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with currentPage + 1 when Next is clicked", () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={onPageChange} />
    );
    fireEvent.click(screen.getByTestId("pagination-next"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
