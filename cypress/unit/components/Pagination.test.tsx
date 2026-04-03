import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "@/components/Pagination";

describe("Pagination - Branch Coverage", () => {
  it("does not render when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("does not render when totalPages is 0", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
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

  it("handles small total pages (2 pages)", async () => {
    render(
      <Pagination currentPage={1} totalPages={2} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(2);
    expect(pages[0]).toHaveTextContent("1");
    expect(pages[1]).toHaveTextContent("2");
  });

  it("handles currentPage at start with many pages", async () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
    expect(pages[0]).toHaveTextContent("1");
  });

  it("handles currentPage at end with many pages", async () => {
    render(
      <Pagination currentPage={10} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
    expect(pages[4]).toHaveTextContent("10");
  });

  it("handles currentPage in middle with exact 5 pages", async () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
    expect(pages[0]).toHaveTextContent("1");
    expect(pages[4]).toHaveTextContent("5");
  });

  it("handles currentPage in middle with many pages", async () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
    expect(pages[2]).toHaveTextContent("5");
  });

  it("applies active styling to current page", async () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    const activePage = pages.find(p => p.textContent === "3");
    expect(activePage).toBeInTheDocument();
    expect(activePage?.className).toMatch(/bg-\[#FF4500\]|text-white/);
  });

  it("applies normal styling to non-active pages", async () => {
    render(
      <Pagination currentPage={3} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    const normalPage = pages.find(p => p.textContent === "2");
    expect(normalPage).toBeInTheDocument();
    expect(normalPage?.className).toMatch(/bg-\[#1E1E2C\]|border|text-\[#9B9BAD\]/);
  });

  it("enables all buttons when not on first/last page and isNextDisabled is false", () => {
    render(
      <Pagination currentPage={3} totalPages={10} isNextDisabled={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-first")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-prev")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-next")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-last")).not.toBeDisabled();
  });

  it("handles isNextDisabled false on last page", () => {
    render(
      <Pagination currentPage={5} totalPages={5} isNextDisabled={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
    expect(screen.getByTestId("pagination-last")).toBeDisabled();
  });

  it("renders pagination container", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    const container = screen.getByTestId("pagination");
    expect(container).toBeInTheDocument();
    expect(container.className).toMatch(/flex|justify-center|items-center/);
  });

  it("shows correct page numbers for edge cases", async () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(3);
    expect(pages[0]).toHaveTextContent("1");
    expect(pages[1]).toHaveTextContent("2");
    expect(pages[2]).toHaveTextContent("3");
  });

  it("triggers the first branch of totalPages <= 1 condition", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("triggers the first branch of currentPage === 1 conditions (disabled state)", () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-first")).toBeDisabled();
    expect(screen.getByTestId("pagination-prev")).toBeDisabled();
  });

  it("triggers the second branch of currentPage === 1 conditions (enabled state)", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-first")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-prev")).not.toBeDisabled();
  });

  it("triggers the first branch of complex OR conditions for Next/Last buttons", () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-next")).toBeDisabled();
    expect(screen.getByTestId("pagination-last")).toBeDisabled();
  });

  it("triggers the second branch of complex OR conditions for Next/Last buttons", () => {
    render(
      <Pagination currentPage={3} totalPages={5} isNextDisabled={false} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-next")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-last")).not.toBeDisabled();
  });

  it("triggers Boolean(isNextDisabled) conversion with undefined", () => {
    render(
      <Pagination currentPage={3} totalPages={5} isNextDisabled={undefined} onPageChange={vi.fn()} />
    );
    expect(screen.getByTestId("pagination-next")).not.toBeDisabled();
    expect(screen.getByTestId("pagination-last")).not.toBeDisabled();
  });

  it("triggers Math.max first branch when currentPage - halfShow < 1", async () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages[0]).toHaveTextContent("1");
  });

  it("triggers Math.max second branch when currentPage - halfShow >= 1", async () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages[0]).toHaveTextContent("3");
  });

  it("triggers Math.min first branch when totalPages < start + showPages - 1", async () => {
    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(3);
  });

  it("triggers Math.min second branch when totalPages >= start + showPages - 1", async () => {
    render(
      <Pagination currentPage={1} totalPages={10} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
  });

  it("triggers Math.max in the adjustment logic when end - showPages + 1 < 1", async () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(3);
    expect(pages[0]).toHaveTextContent("1");
  });

  it("triggers Math.max in the adjustment logic when end - showPages + 1 >= 1", async () => {
    render(
      <Pagination currentPage={4} totalPages={6} onPageChange={vi.fn()} />
    );
    const pages = await screen.findAllByTestId("pagination-page");
    expect(pages.length).toBe(5);
    expect(pages[0]).toHaveTextContent("2");
  });
});
