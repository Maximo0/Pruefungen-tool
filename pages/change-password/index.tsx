import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ChangePassword({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  /**
   * Ändert das Passwort
   * @param event FormEvent
   * @returns
   */
  async function handleForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const oldPassword = (event.target as HTMLFormElement).oldPassword.value;
    const password = (event.target as HTMLFormElement).password.value;
    const passwordConfirm = (event.target as HTMLFormElement).passwordConfirm
      .value;

    if (!password || !passwordConfirm || !oldPassword) {
      setError(true);
      return setErrorMessage("Bitte fülle alle Felder aus.");
    }

    const data = {
      password: password,
      passwordConfirm: passwordConfirm,
      oldPassword: oldPassword,
    };

    try {
      await fetch("/api/user/update", {
        method: "POST",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res);

          if (res.status == 400) {
            setError(true);
            if (res.response.data.oldPassword) {
              return setErrorMessage("Fehlendes oder Falsches Altes Passwort.");
            } else if (res.response.data.password) {
              return setErrorMessage(
                "Neues passwort muss mindestens 8 Zeichen lang sein."
              );
            } else if (res.response.data.passwordConfirm) {
              return setErrorMessage(
                "Wiederholtes Passwort stimmt nicht überein."
              );
            }
          }
          if (res.updatedUser) {
            router.push("/login", "/login", {
              locale: router.locale,
            });
          }
        });
    } catch (err) {
      console.log(err);
      setError(true);
      setErrorMessage("Etwas ging schief.");
    }
  }

  return (
    <>
      <Head>
        <title>Passwort ändern</title>
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
          <Button href="/" sx={{ marginLeft: "-.5rem", marginBottom: "1rem"}}>
            <ArrowBackIosNew />
            <Typography>Zurück</Typography>
          </Button>
          <form onSubmit={handleForm}>
            <FormControl error={error}>
              <Typography variant="h4" textAlign="center">
                Passwort ändern
              </Typography>
              {error && (
                <FormHelperText
                  sx={{ marginBottom: ".5rem", textAlign: "center" }}
                >
                  {errorMessage}
                </FormHelperText>
              )}
              <TextField
                sx={{ marginBottom: ".25rem" }}
                name="oldPassword"
                label="Altes Passwort"
                variant="standard"
                type="password"
              />
              <TextField
                sx={{ marginBottom: ".25rem" }}
                name="password"
                label="Neues Passwort"
                variant="standard"
                type="password"
              />
              <TextField
                name="passwordConfirm"
                label="Passwort wiederholen"
                variant="standard"
                type="password"
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ marginTop: "2rem" }}
              >
                Passwort ändern
              </Button>
            </FormControl>
          </form>
        </Paper>
      </Box>
    </>
  );
}

/**
 * Kümmert sich um die Authentifizierung
 * @param context
 * @returns
 */
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
