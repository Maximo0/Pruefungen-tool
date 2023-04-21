import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { setCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import PocketBase, { type AuthProviderInfo } from "pocketbase";
import { useState } from "react";

export default function LoginPage({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  const [error, setError] = useState(false);
  const router = useRouter();

  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pb = new PocketBase(process.env.PocketbaseIP);

    const username = (event.target as HTMLFormElement).username.value;
    const password = (event.target as HTMLFormElement).password.value;

    try {
      await pb
        .collection("users")
        .authWithPassword(username, password)
        .then((res) => {
          const authStoreLocalStorage = localStorage.getItem("pocketbase_auth");

          if (authStoreLocalStorage) {
            setCookie("pb_auth", authStoreLocalStorage, {
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
              sameSite: "strict",
            });

            localStorage.removeItem("pocketbase_auth");

            router.push("/login", "/login", {
              locale: router.locale,
            });
          }
        });
    } catch (err) {
      setError(true);
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Paper sx={{ padding: "2rem" }}>
          <form onSubmit={handleForm}>
            <FormControl error={error}>
              <Typography variant="h4" textAlign="center">Login</Typography>
              {error && (
                <FormHelperText>Wrong username or password</FormHelperText>
              )}
              <TextField name="username" label="Username" variant="standard" />
              <TextField
                name="password"
                label="Password"
                variant="standard"
                type="password"
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "2rem" }}
              >
                Login
              </Button>
            </FormControl>
          </form>
        </Paper>
      </Box>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pb = await initPocketbase(context);

  const authData = JSON.parse(JSON.stringify(pb.authStore));

  if (pb.authStore.isValid) {
    return {
      redirect: {
        destination: "/",
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
