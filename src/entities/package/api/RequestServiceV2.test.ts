import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { RequestServiceV2 } from "./RequestServiceV2";

vi.mock("axios");

describe("RequestServiceV2", () => {
  const createMock = vi.mocked(axios.create);
  const responseUse = vi.fn();
  const get = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    createMock.mockReturnValue({
      get,
      interceptors: {
        response: {
          use: responseUse,
        },
      },
    } as never);
  });

  it("creates v2 request client", () => {
    new RequestServiceV2();

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/v2/request",
    });
    expect(responseUse).toHaveBeenCalledTimes(1);
  });

  it("sends payment systems request with travel agency query and auth", async () => {
    const service = new RequestServiceV2();

    await service.getPaymentSystems(5, "token");

    expect(get).toHaveBeenCalledWith("PaymentSystems", {
      params: {
        travelAgencyId: 5,
      },
      headers: {
        Authorization: "Bearer token",
      },
    });
  });

  it("propagates payment systems request errors", async () => {
    const service = new RequestServiceV2();
    const error = new Error("payment system unavailable");
    get.mockRejectedValueOnce(error);

    await expect(service.getPaymentSystems(2, "token")).rejects.toBe(error);
  });
});
