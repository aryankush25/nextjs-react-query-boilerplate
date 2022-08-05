import { isPresent } from "./helpers";

export const tokenConstant = "token";

interface DataToAddInCookies {
  [key: string]: string;
}

export const getDataFromCookie = (
  cname: string,
  cookiesString: string = ""
) => {
  const name = cname + "=";
  const decodedCookie = isPresent(cookiesString)
    ? cookiesString
    : typeof document !== "undefined"
    ? decodeURIComponent(document.cookie)
    : "";
  const cookieArr = decodedCookie.split("; ");

  let res: string = "";
  cookieArr.forEach((cookie) => {
    if (cookie.indexOf(name) === 0) {
      res = cookie.substring(name.length);
    }
  });

  return res;
};

export const saveDataInCookies = (
  data: DataToAddInCookies,
  expiresIn?: number | null
) => {
  const keys = Object.keys(data);

  if (isPresent(expiresIn)) {
    const d = new Date((expiresIn || 0) * 1000);

    keys.forEach((key) => {
      document.cookie = `${key}=${
        data[key]
      }; expires=${d.toUTCString()}; path=/;`;
    });
  } else {
    keys.forEach((key) => {
      document.cookie = `${key}=${data[key]}; path=/;`;
    });
  }
};

export const clearDataInCookies = (cookiesToClear: string[] | string) => {
  if (!Array.isArray(cookiesToClear)) {
    cookiesToClear = [cookiesToClear];
  }

  cookiesToClear.forEach(() => {
    document.cookie = `${cookiesToClear}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

export const clearAllCookies = () => {
  const decodedCookie =
    typeof document !== "undefined" ? decodeURIComponent(document.cookie) : "";
  const cookieArr = decodedCookie.split("; ");

  cookieArr.forEach((cookie) => {
    const cookieSplit = cookie.split("=");

    document.cookie = `${cookieSplit[0]}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};
