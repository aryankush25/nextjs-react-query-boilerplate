import { useCallback } from "react";
import * as R from "ramda";
import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { userLogin } from "../../src/services/userAPIs";
import {
  getDataFromCookie,
  saveDataInCookies,
  tokenConstant,
} from "../../src/utils/tokenHelpers";
import { registerRoute, rootRoute } from "../../src/utils/routes";

interface IFormInputs {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const router = useRouter();

  const { isLoading, isError, isSuccess, error, mutate, reset } = useMutation(
    userLogin,
    {
      onSuccess: (response) => {
        saveDataInCookies({ [tokenConstant]: response.token });
        router.push(rootRoute, undefined, { shallow: true });
      },
    }
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    defaultValues: { email: "aryan@gluelabs.com", password: "test@123" },
  });

  const onSubmit: SubmitHandler<IFormInputs> = useCallback(
    (data: IFormInputs) => mutate(data),
    [mutate]
  );

  if (isError) {
    return (
      <div>
        <div>{R.pathOr("Something went wrong.", ["message"], error)}</div>
        <div>
          <button type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center justify-center pt-20"
    >
      <div className="pb-3.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>

        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="email"
            className="block w-full px-5 border-gray-300 rounded-md focus:border-primary focus:ring-primary sm:text-sm"
            {...register("email", { required: true })}
          />
        </div>

        {errors.email && "Email is required"}
      </div>

      <div className="pb-3.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>

        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="password"
            className="block w-full px-5 border-gray-300 rounded-md focus:border-primary focus:ring-primary sm:text-sm"
            {...register("password", { required: true })}
          />
        </div>
        <br />

        {errors.password && "Password is required"}
      </div>

      <input
        type="submit"
        className={clsx(
          "inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm",
          (isLoading || isSuccess) && "cursor-not-allowed bg-primary text-white"
        )}
        disabled={isLoading || isSuccess}
        value={
          isLoading ? "Logging in" : isSuccess ? "Redirecting..." : "Login"
        }
      />

      <br />

      <div>
        {"Don't have an account?"} <Link href={registerRoute}>Register</Link>
      </div>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isAuthenticated = !!getDataFromCookie(
    tokenConstant,
    context.req.headers.cookie
  );

  return {
    props: {},
    ...(isAuthenticated ? { redirect: { destination: rootRoute } } : {}),
  };
};

export default Login;
