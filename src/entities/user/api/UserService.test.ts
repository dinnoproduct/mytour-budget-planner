import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { UserService } from "./UserService";

vi.mock("axios");

describe("UserService", () => {
  const createMock = vi.mocked(axios.create);
  const responseUse = vi.fn();
  const post = vi.fn();
  const get = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com";
    createMock.mockReturnValue({
      post,
      get,
      interceptors: {
        response: {
          use: responseUse,
        },
      },
    } as never);
  });

  it("initializes axios with user base URL", () => {
    new UserService();

    expect(createMock).toHaveBeenCalledWith({
      baseURL: "https://api.example.com/user",
    });
    expect(responseUse).toHaveBeenCalledTimes(1);
  });

  it("sends bearer token and body when updating user", async () => {
    const service = new UserService();
    const token = "access-token";
    const input = { firstName: "John" } as never;

    await service.updateUser(token, input);

    expect(post).toHaveBeenCalledWith("updateUserInfo", input, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("sends bearer token when getting user", async () => {
    const service = new UserService();
    const token = "access-token";

    await service.getUser(token);

    expect(get).toHaveBeenCalledWith("getUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  it("propagates api error from getUser", async () => {
    const service = new UserService();
    const error = new Error("unauthorized");
    get.mockRejectedValueOnce(error);

    await expect(service.getUser("token")).rejects.toBe(error);
  });
});
