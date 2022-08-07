import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import * as R from "ramda";
import { getCurrentUser } from "../src/services/userAPIs";
import { loginRoute } from "../src/utils/routes";
import {
  clearDataInCookies,
  getDataFromCookie,
  tokenConstant,
} from "../src/utils/tokenHelpers";

interface HomeProps {
  user: {
    age: number;
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

const Home: NextPage<HomeProps> = ({ user }) => {
  const router = useRouter();

  console.log("#### user", user);

  return (
    <div>
      <div>Hello</div>
      <div>
        <button
          onClick={() => {
            clearDataInCookies(tokenConstant);
            router.push(loginRoute);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authToken = getDataFromCookie(
    tokenConstant,
    context.req.headers.cookie
  );

  let isAuthenticated = !!authToken;
  let userResponse;

  if (isAuthenticated) {
    userResponse = await getCurrentUser("");
  }

  return {
    props: { user: R.pathOr(null, ["data"], userResponse) },
    ...(isAuthenticated ? {} : { redirect: { destination: loginRoute } }),
  };
};

export default Home;
