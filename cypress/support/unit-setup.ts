import "@testing-library/jest-dom";
import { configure } from "@testing-library/react";

configure({ testIdAttribute: "data-test" });

global.IntersectionObserver = class IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  constructor(private cb: IntersectionObserverCallback) {}
  observe() { this.cb([], this as unknown as IntersectionObserver); }
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
};

const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (
    typeof message === 'string' && 
    (message.includes('ERR_REQUIRE_ESM') || 
     message.includes('html-encoding-sniffer') ||
     message.includes('@exodus/bytes'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
