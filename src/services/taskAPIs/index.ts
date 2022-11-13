import { ApiRequestMethods } from "../../utils/enums";
import fetchForData from "../restApiService";

export const tasksRoute = "/tasks";

export const getCurrentUserTasks = async (authToken?: string) => {
  const response = await fetchForData(ApiRequestMethods.get, tasksRoute, true, {
    authToken,
  });

  return response.data;
};
