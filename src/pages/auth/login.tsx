import { githubConfig } from "@/config";
import { Layout as AuthLayout } from "@/layouts/auth";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { NextPage } from "next";
import Head from "next/head";

const Page: NextPage = () => {
  function onClickLogin() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + githubConfig.client_id);
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div>
        <Grid container component="main">
          <CssBaseline />
          <Grid
            item
            xs={false}
            boxShadow={3}
            sm={4}
            md={7}
            sx={{
              backgroundImage: "url(/assets/logos/github-octocat.png)",
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
              <Typography component="h1" variant="h5">
                Sign in
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Button onClick={onClickLogin} type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
