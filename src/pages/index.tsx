import { AuthContextType } from "@/contexts/auth/jwt-context";
import { getUserInfo, getUserRepos, useAuth, useGetUserInfo, useGetUserRepos } from "@/hooks";
import { paths } from "@/paths";
import { Avatar, Button, Card } from "@mui/material";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import { Layout as DashboardLayout } from "layouts/dashboard-layout";
import type { NextApiRequest, NextApiResponse, NextPage } from "next";
import { useRouter } from "next/router";

const Page: NextPage = (props) => {
  const { data: userReposData } = useGetUserRepos({ fetchUserRepoUrl: "" });
  const { data: userInfoData } = useGetUserInfo({ enabled: true });
  const router = useRouter();

  const { signOut } = useAuth<AuthContextType>();

  function onClickExit() {
    signOut();
    router.push(paths.auth);
  }

  function onClickGithubAccount() {
    window.location.assign(userInfoData?.html_url || "");
  }

  return (
    <main className={`flex min-h-screen  flex-col items-center justify-between p-24 `}>
      <Box
        sx={{
          bgcolor: "background.paper",
          pt: 8,
          pb: 6,
        }}
      >
        <Container
          sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}
          maxWidth="sm"
        >
          <Avatar sx={{ width: 56, height: 56 }} alt="Avatar" src={userInfoData?.avatar_url} />

          <Typography component="h1" variant="h2" align="center" color="text.primary" gutterBottom>
            {userInfoData?.login}
          </Typography>

          <Stack sx={{ pt: 4 }} direction="row" spacing={2} justifyContent="center">
            <Button onClick={onClickGithubAccount} variant="contained">
              Github Account
            </Button>
            <Button onClick={onClickExit} color="error" variant="outlined">
              Exit
            </Button>
          </Stack>
        </Container>
      </Box>
      <Container>
        <Grid alignContent={"center"} justifyContent={"center"} container spacing={4}>
          {userReposData?.map((userRepo, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  sx={
                    {
                      // 16:9
                    }
                  }
                  image={"/assets/logos/github-octocat.png"}
                  alt="random"
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {userRepo.name}
                  </Typography>
                  <Typography>{userRepo.description}</Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => {
                        window.location.assign(userRepo?.html_url || "");
                  }} size="small">View</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </main>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export async function getServerSideProps({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
  const queryClient = new QueryClient();
  const token = getCookie("Authorization", { req, res }) as string;
  await queryClient.prefetchQuery(["userInfo"], () => getUserInfo({ token }));
  const userInfoData: TGithubUser = queryClient.getQueriesData(["userInfo"])[0][1] as TGithubUser;
  await queryClient.prefetchQuery(["userRepos"], () =>
    getUserRepos({ token, fetchUserRepoUrl: userInfoData.repos_url })
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Page;
