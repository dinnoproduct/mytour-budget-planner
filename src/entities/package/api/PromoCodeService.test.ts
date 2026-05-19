import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { PromoCodeService } from "./PromoCodeService";

vi.mock("axios");

describe("PromoCodeService", () => {
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

  it("creates v2 promo code client", () => {
    new PromoCodeService();

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/V2/PromoCode/",
    });
    expect(responseUse).toHaveBeenCalledTimes(1);
  });

  it("sends validate request with auth and platform headers", async () => {
    const service = new PromoCodeService();
    const payload = { code: "SAVE10" } as never;

    await service.validate(payload, "token");

    expect(post).toHaveBeenCalledWith("/Validate", payload, {
      headers: {
        Authorization: "Bearer token",
        Platform: "Web",
      },
    });
  });

  it("propagates validation failures", async () => {
    const service = new PromoCodeService();
    const error = new Error("invalid code");
    post.mockRejectedValueOnce(error);

    await expect(service.validate({} as never, "token")).rejects.toBe(error);
  });
});
