import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { AuthService } from "./AuthService";

vi.mock("axios");

describe("AuthService", () => {
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

  it("creates axios instance with user base URL", () => {
    new AuthService();

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/user",
    });
  });

  it("wires response interceptor with success passthrough and reject handler", async () => {
    new AuthService();

    expect(responseUse).toHaveBeenCalledTimes(1);
    const [successHandler, errorHandler] = responseUse.mock.calls[0];
    expect(successHandler({ data: 123 })).toBe(123);

    const error = new Error("network");
    await expect(errorHandler(error)).rejects.toBe(error);
  });

  it("posts register payload to register endpoint", async () => {
    const service = new AuthService();
    const payload = { email: "john@doe.com" } as never;

    await service.register(payload);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/register", payload);
  });

  it("posts confirm registration payload to confirmRegistration endpoint", async () => {
    const service = new AuthService();
    const payload = { otp: "1234" } as never;

    await service.confirmRegistration(payload);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/confirmRegistration", payload);
  });

  it("posts confirm login payload to confirmLogin endpoint", async () => {
    const service = new AuthService();
    const payload = { otp: "9999" } as never;

    await service.confirmLogin(payload);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/confirmLogin", payload);
  });

  it("posts login payload with json-patch content type header", async () => {
    const service = new AuthService();
    const payload = { token: "123456" } as never;

    await service.login(payload);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/login", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
  });

  it("posts resend OTP payload with json-patch content type header", async () => {
    const service = new AuthService();
    const payload = { email: "john@doe.com" } as never;

    await service.resendOTP(payload);

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith("/resendOTP", payload, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
  });

  it("propagates request errors from login", async () => {
    const service = new AuthService();
    const error = new Error("request failed");
    post.mockRejectedValueOnce(error);

    await expect(service.login({} as never)).rejects.toBe(error);
  });
});
