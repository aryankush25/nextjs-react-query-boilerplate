import { useCallback } from "react";
import * as R from "ramda";
import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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

  const { isLoading, isError, error, mutate, reset } = useMutation(userLogin, {
    onSuccess: (response) => {
      saveDataInCookies({ [tokenConstant]: response.data.token });
      router.push(rootRoute);
    },
  });

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
          <button onClick={reset}>Reset</button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email">Email</label>
        <br />

        <input {...register("email", { required: true })} />
        <br />

        {errors.email && "Email is required"}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <br />

        <input {...register("password", { required: true })} />
        <br />

        {errors.password && "Password is required"}
      </div>

      <input
        type="submit"
        disabled={isLoading}
        value={isLoading ? "Logging in" : "Login"}
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
