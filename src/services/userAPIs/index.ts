import { ApiRequestMethods } from "../../utils/enums";
import fetchForData from "../restApiService";

export const loginRoute = "/users/login";
export const createAccountRoute = "/users";
export const meRoute = "/users/me";

export const userLogin = async (data: Object | undefined) => {
  const response = await fetchForData(
    ApiRequestMethods.post,
    loginRoute,
    false,
    { data }
  );

  return response;
};

export const userCreateAccount = async (data: Object | undefined) => {
  const response = await fetchForData(
    ApiRequestMethods.post,
    createAccountRoute,
    false,
    { data }
  );

  return response;
};

export const getCurrentUser = async (authToken: string) => {
  const response = await fetchForData(ApiRequestMethods.get, meRoute, true, {
    authToken,
  });

  return response;
};
