import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import * as R from "ramda";
import { getCurrentUserTasks } from "../src/services/taskAPIs";
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
  tasks: {
    completed: boolean;
    createdAt: string;
    description: string;
    owner: string;
    updatedAt: string;
    _id: string;
  }[];
}

const Home: NextPage<HomeProps> = ({ user, tasks }) => {
  const router = useRouter();

  console.log("#### user", user);
  console.log("#### tasks", tasks);

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
  let taskResponse;

  if (isAuthenticated) {
    [userResponse, taskResponse] = await Promise.all([
      getCurrentUser(authToken),
      getCurrentUserTasks(authToken),
    ]);
  }

  return {
    props: {
      user: R.pathOr(null, ["data"], userResponse),
      tasks: R.pathOr(null, ["data"], taskResponse),
    },
    ...(isAuthenticated ? {} : { redirect: { destination: loginRoute } }),
  };
};

export default Home;
