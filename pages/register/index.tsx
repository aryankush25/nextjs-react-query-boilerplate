import { useCallback } from "react";
import * as R from "ramda";
import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { userCreateAccount } from "../../src/services/userAPIs";
import {
  getDataFromCookie,
  saveDataInCookies,
  tokenConstant,
} from "../../src/utils/tokenHelpers";
import { loginRoute, rootRoute } from "../../src/utils/routes";

interface IFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register: NextPage = () => {
  const router = useRouter();

  const { isLoading, isError, error, mutate, reset } = useMutation(
    userCreateAccount,
    {
      onSuccess: (response) => {
        saveDataInCookies({ [tokenConstant]: response.data.token });
        router.push(rootRoute);
      },
    }
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInputs>({
    defaultValues: {
      name: "Aryan agarwal",
      email: "aryan@gluelabs.com",
      password: "test@123",
    },
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
        <label htmlFor="name">Name</label>
        <br />

        <input {...register("name", { required: true })} />
        <br />

        {errors.name && "Name is required"}
      </div>

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
        value={isLoading ? "Creating your account." : "Register"}
      />

      <br />

      <div>
        {"Already have an account?"} <Link href={loginRoute}>Login</Link>
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

export default Register;
