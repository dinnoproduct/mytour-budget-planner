import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { SearchService } from "./SearchService";

vi.mock("axios");

describe("SearchService", () => {
  const createMock = vi.mocked(axios.create);
  const responseUse = vi.fn();
  const post = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    createMock.mockReturnValue({
      post,
      interceptors: {
        response: {
          use: responseUse,
        },
      },
    } as never);
  });

  it("initializes v2 search base URL", () => {
    new SearchService();

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/V2/Search/",
    });
    expect(responseUse).toHaveBeenCalledTimes(1);
  });

  it("posts search payload to root endpoint", async () => {
    const service = new SearchService();
    const payload = { cityId: 1 } as never;

    await service.search(payload);

    expect(post).toHaveBeenCalledWith("", payload);
  });

  it("propagates search request errors", async () => {
    const service = new SearchService();
    const error = new Error("search failed");
    post.mockRejectedValueOnce(error);

    await expect(service.search({} as never)).rejects.toBe(error);
  });
});
