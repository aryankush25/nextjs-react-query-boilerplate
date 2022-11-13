import { useQuery } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { getCurrentUserTasks } from "../src/services/taskAPIs";
import { getCurrentUser } from "../src/services/userAPIs";
import { isNilOrEmpty } from "../src/utils/helpers";
import { loginRoute } from "../src/utils/routes";
import {
  clearDataInCookies,
  getDataFromCookie,
  tokenConstant,
} from "../src/utils/tokenHelpers";

interface TaskProps {
  completed: boolean;
  createdAt: string;
  description: string;
  owner: string;
  updatedAt: string;
  _id: string;
}

interface UserProps {
  age: number;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface HomeProps {
  user: UserProps;
  tasks: TaskProps[];
}

const Home: NextPage<HomeProps> = ({ user, tasks }) => {
  const router = useRouter();
  console.log("#### user", user);
  console.log("#### tasks", tasks);

  const { data: userData } = useQuery(["userData"], () => getCurrentUser(), {
    initialData: user,
    enabled: isNilOrEmpty(user),
  });
  const { data: userTasksData } = useQuery(
    ["userTasksData"],
    () => getCurrentUserTasks(),
    {
      initialData: tasks,
      enabled: isNilOrEmpty(tasks),
    }
  );

  console.log("#### userData", userData);
  console.log("#### userTasksData", userTasksData);

  return (
    <div>
      <div>Hello {userData.name}</div>

      <div>
        <button
          type="button"
          onClick={() => {
            clearDataInCookies(tokenConstant);
            router.push(loginRoute);
          }}
        >
          Logout
        </button>
      </div>

      <br />
      <br />

      {userTasksData.map((task: TaskProps) => {
        return (
          <div key={task._id}>
            <div>{task.description}</div>
            <div>{task.completed ? "Completed" : "Pending"}</div>
            <hr />
          </div>
        );
      })}
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
      user: userResponse,
      tasks: taskResponse,
    },
    ...(isAuthenticated ? {} : { redirect: { destination: loginRoute } }),
  };
};

export default Home;
