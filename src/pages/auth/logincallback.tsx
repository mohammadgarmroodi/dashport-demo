import { githubConfig } from "@/config";
import { useAuth, useGetAccessToken } from "@/hooks/auth";
import { Layout as AuthLayout } from "@/layouts/auth";
import { Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { AxiosError } from "axios";
import type { AuthContextType } from "contexts/auth/jwt-context";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

const Page: NextPage = () => {
  const router = useRouter();
  const { signIn } = useAuth<AuthContextType>();
  const { isFetching } = useGetAccessToken({
    code: router.query.code,
    onSuccessHandle: (accessToken: string) => {
      toast.success("Success Login!");
      signIn(accessToken);
      router.push("/");
    },
    onErrorHandle: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Waiting...</title>
      </Head>
      <Box sx={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <Typography>Please Wait...</Typography>
        <CircularProgress />
      </Box>
    </>
  );
};

Page.getLayout = (page) => <AuthLayout>{page}</AuthLayout>;

export default Page;
