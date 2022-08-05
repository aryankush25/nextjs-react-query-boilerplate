import type { GetServerSideProps, NextPage } from "next";
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
    ...(isAuthenticated ? {} : { redirect: { destination: "/login" } }),
  };
};

export default Home;
