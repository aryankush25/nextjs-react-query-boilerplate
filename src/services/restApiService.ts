import { ApiRequestMethods } from "./../utils/enums";
import axios from "axios";
import { tokenConstant, getDataFromCookie } from "../utils/tokenHelpers";
import { isPresent } from "../utils/helpers";

const fetchForData = async (
  method: ApiRequestMethods,
  route: string,
  authorization: boolean,
  { data, authToken }: { data?: Object; authToken?: string } = {}
) => {
  const url = "https://task-manager-aryankush25.herokuapp.com" + route;

  const headers = {
    "Content-Type": "application/json",
    ...(authorization && {
      Authorization: `Bearer ${
        isPresent(authToken) ? authToken : getDataFromCookie(tokenConstant)
      }`,
    }),
  };

  let apiCallPromise;

  switch (method) {
    case ApiRequestMethods.get:
      apiCallPromise = axios.get(url, { headers });
      break;
    case ApiRequestMethods.post:
      apiCallPromise = axios.post(url, data, { headers });
      break;
    case ApiRequestMethods.patch:
      apiCallPromise = axios.patch(url, data, { headers });
      break;
    case ApiRequestMethods.delete:
      apiCallPromise = axios.delete(url, { headers });
      break;
    case ApiRequestMethods.put:
      apiCallPromise = axios.put(url, data, { headers });
      break;
    default:
      throw new Error("method not found");
  }

  return apiCallPromise;
};

export default fetchForData;
