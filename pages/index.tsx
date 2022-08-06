import type { GetServerSideProps, NextPage } from "next";
import { loginRoute } from "../src/utils/routes";
import { getDataFromCookie, tokenConstant } from "../src/utils/tokenHelpers";

const Home: NextPage = () => {
  return <div>Hello</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isAuthenticated = !!getDataFromCookie(
    tokenConstant,
    context.req.headers.cookie
  );

  return {
    props: {},
    ...(isAuthenticated ? {} : { redirect: { destination: loginRoute } }),
  };
};

export default Home;
