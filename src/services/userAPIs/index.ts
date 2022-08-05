import { ApiRequestMethods } from "../../utils/enums";
import fetchForData from "../restApiService";

export const loginRoute = "/users/login";

export const userLogin = async (data: Object | undefined) => {
  const response = fetchForData(
    ApiRequestMethods.post,
    loginRoute,
    false,
    data
  );

  return response;
};
