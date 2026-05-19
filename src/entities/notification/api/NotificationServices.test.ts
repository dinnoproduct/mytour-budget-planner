import { beforeEach, describe, expect, it, vi } from "vitest";
import { PriceAlertService } from "./PriceAlertService";
import { HotelInquiriesService } from "./HotelInquiriesService";
import { SplashNotificationService } from "./SplashNotificationService";

const { responseUse, post, get, createMock } = vi.hoisted(() => {
  const hoistedResponseUse = vi.fn();
  const hoistedPost = vi.fn();
  const hoistedGet = vi.fn();
  const hoistedCreateMock = vi.fn(() => ({
    post: hoistedPost,
    get: hoistedGet,
    interceptors: {
      response: {
        use: hoistedResponseUse,
      },
    },
  }));

  return {
    responseUse: hoistedResponseUse,
    post: hoistedPost,
    get: hoistedGet,
    createMock: hoistedCreateMock,
  };
});

vi.mock("axios", () => ({
  default: {
    create: createMock,
  },
  create: createMock,
}));

describe("notification api services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
  });

  it("PriceAlertService configures base URL and posts subscription payload", async () => {
    const service = new PriceAlertService();
    const payload = { email: "john@doe.com" } as never;

    await service.subscribe(payload);

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com",
    });
    expect(post).toHaveBeenCalledWith("/external/price-alerts-subscribe", payload);
  });

  it("HotelInquiriesService posts inquiry payload", async () => {
    const service = new HotelInquiriesService();
    const payload = { fullName: "John Doe" } as never;

    await service.createInquiry(payload);

    expect(post).toHaveBeenCalledWith("/External/Hotel-Inquiries", payload);
  });

  it("SplashNotificationService sends getActive request with params and headers", async () => {
    const service = new SplashNotificationService();

    await service.getActive("en", "user-1");

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/v2/external",
    });
    expect(get).toHaveBeenCalledWith("/SplashNotifications", {
      params: { userId: "user-1" },
      headers: {
        platform: "web",
        "Content-Language": "en",
        limit: 1,
      },
    });
  });

  it("SplashNotificationService sends markViewed request with params", async () => {
    const service = new SplashNotificationService();
    const payload = { splashNotificationId: "n1" } as never;

    await service.markViewed(payload, "user-2");

    expect(post).toHaveBeenCalledWith("/SplashNotificationViewed", payload, {
      params: { userId: "user-2" },
      headers: {
        platform: "web",
      },
    });
  });

  it("propagates API errors from notification services", async () => {
    const priceAlertService = new PriceAlertService();
    const error = new Error("bad gateway");
    post.mockRejectedValueOnce(error);

    await expect(priceAlertService.subscribe({} as never)).rejects.toBe(error);
  });
});
