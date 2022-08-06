import type { GetServerSideProps, NextPage } from "next";
import * as R from "ramda";
import { getCurrentUser } from "../src/services/userAPIs";
import { loginRoute } from "../src/utils/routes";
import { getDataFromCookie, tokenConstant } from "../src/utils/tokenHelpers";

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
  console.log("#### user", user);

  return <div>Hello</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authToken = getDataFromCookie(
    tokenConstant,
    context.req.headers.cookie
  );

  let isAuthenticated = !!authToken;

  let userResponse;

  if (isAuthenticated) {
    try {
      userResponse = await getCurrentUser(authToken);
    } catch (error) {
      isAuthenticated = false;
    }
  }

  return {
    props: { user: R.pathOr(null, ["data"], userResponse) },
    ...(isAuthenticated ? {} : { redirect: { destination: loginRoute } }),
  };
};

export default Home;
