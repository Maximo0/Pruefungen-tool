import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import { Box, Grid, Typography } from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";

export default function Upload({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  return (
    <>
      <Head>
        <title>Upload</title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Typography variant="h2">Upload</Typography>
        <Typography variant="h3">WIP</Typography>
      </Grid>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pb = await initPocketbase(context);

  const authData = JSON.parse(JSON.stringify(pb.authStore));

  if (!pb.authStore.isValid) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      isLoggedIn: pb.authStore.isValid,
      authData: authData.baseModel,
    },
  };
}
