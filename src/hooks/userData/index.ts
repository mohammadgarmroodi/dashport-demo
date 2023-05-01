import { useQuery } from "@tanstack/react-query";
import { serverInstance } from "../instance";

//Api
const getUserInfo = async ({ token }: { token?: string }): Promise<TGithubUser> => {
  const { data } = await serverInstance.get("/user", {
    headers: {
      Authorization: "token " + token,
    },
  });
  return data;
};

const getUserRepos = async ({
  fetchUserRepoUrl,
  token,
}: {
  fetchUserRepoUrl: string;
  token?: string;
}): Promise<TGithubRepo[]> => {
  const { data } = await serverInstance.get(fetchUserRepoUrl, {
    headers: {
      Authorization: "token " + token,
    },
  });
  return data;
};

function useGetUserInfo({enabled=true}:{enabled?:boolean}) {
  return useQuery(["userInfo"], () => getUserInfo({}), {enabled});
}

function useGetUserRepos({ fetchUserRepoUrl }: { fetchUserRepoUrl: string }) {
  return useQuery(["userRepos"], () => getUserRepos({ fetchUserRepoUrl }), { enabled: fetchUserRepoUrl.length>0});
}
export { useGetUserInfo, useGetUserRepos, getUserRepos, getUserInfo };
