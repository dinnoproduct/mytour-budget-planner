import { beforeEach, describe, expect, it, vi } from "vitest";

const nextResponseMocks = vi.hoisted(() => ({
  redirect: vi.fn(),
  rewrite: vi.fn(),
  next: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: nextResponseMocks,
}));

import { proxy } from "./proxy";

type MockRequest = {
  nextUrl: {
    pathname: string;
    clone: () => { pathname: string };
  };
};

const createRequest = (pathname: string): MockRequest => {
  return {
    nextUrl: {
      pathname,
      clone: () => ({ pathname }),
    },
  };
};

describe("proxy", () => {
  beforeEach(() => {
    nextResponseMocks.redirect.mockReset();
    nextResponseMocks.rewrite.mockReset();
    nextResponseMocks.next.mockReset();

    nextResponseMocks.redirect.mockImplementation(
      (url: { pathname: string }, options: { status: number }) => ({
        type: "redirect",
        pathname: url.pathname,
        status: options.status,
      }),
    );
    nextResponseMocks.rewrite.mockImplementation((url: { pathname: string }) => ({
      type: "rewrite",
      pathname: url.pathname,
    }));
    nextResponseMocks.next.mockImplementation(() => ({ type: "next" }));
  });

  it.each([
    ["/arm", "/"],
    ["/arm/tours", "/tours"],
    ["/hy", "/"],
    ["/hy/about", "/about"],
    ["/eng", "/en"],
    ["/eng/news", "/en/news"],
    ["/rus", "/ru"],
    ["/rus/profile", "/ru/profile"],
  ])("redirects legacy path %s to %s with 301", (pathname, expectedPath) => {
    const result = proxy(createRequest(pathname) as never);

    expect(nextResponseMocks.redirect).toHaveBeenCalledOnce();
    expect(nextResponseMocks.rewrite).not.toHaveBeenCalled();
    expect(nextResponseMocks.next).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: "redirect",
      pathname: expectedPath,
      status: 301,
    });
  });

  it("rewrites root path to default locale", () => {
    const result = proxy(createRequest("/") as never);

    expect(nextResponseMocks.rewrite).toHaveBeenCalledOnce();
    expect(nextResponseMocks.redirect).not.toHaveBeenCalled();
    expect(nextResponseMocks.next).not.toHaveBeenCalled();
    expect(result).toEqual({
      type: "rewrite",
      pathname: "/hy",
    });
  });

  it.each([
    ["/about", "/hy/about"],
    ["/blog/post-1", "/hy/blog/post-1"],
  ])("rewrites non-localized path %s to %s", (pathname, expectedPath) => {
    const result = proxy(createRequest(pathname) as never);

    expect(nextResponseMocks.rewrite).toHaveBeenCalledOnce();
    expect(result).toEqual({
      type: "rewrite",
      pathname: expectedPath,
    });
  });

  it.each(["/en", "/en/tours", "/ru", "/ru/checkout"])(
    "passes through already localized path %s",
    (pathname) => {
      const result = proxy(createRequest(pathname) as never);

      expect(nextResponseMocks.next).toHaveBeenCalledOnce();
      expect(nextResponseMocks.redirect).not.toHaveBeenCalled();
      expect(nextResponseMocks.rewrite).not.toHaveBeenCalled();
      expect(result).toEqual({ type: "next" });
    },
  );
});
