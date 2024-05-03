import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import SelectField from "@/components/Form/SelectField";
import MultiSelectField from "@/components/Form/MultiSelectField";
import { GetServerSidePropsContext } from "next";
import initPocketbase from "@/helpers/initPocketbase";
import { useState } from "react";
import { redirect } from "next/navigation";
import Head from "next/head";
import router, { useRouter } from "next/router";

export default function Edit({
  data,
  tableData,
}: {
  data: any;
  tableData: any;
}) {
  // Data fields for the form
  const [name, setName] = useState(data.name);
  const [kategorie, setKategorie] = useState(
    data.kategorien.map((entry: any) => {
      return tableData.categories.find((category: any) => category.id === entry)
        .name;
    })
  );
  const [bereich, setBereich] = useState(data.expand.bereich.name);
  const [semester, setSemester] = useState(
    `${data.expand.semester.semester} ${data.expand.semester.jahr}`
  );

  return (
    <>
      <Head>
        <title>Edit: {data.id}</title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Card sx={{ marginTop: "2rem", width: "40rem" }}>
            <CardHeader
              avatar={
                <IconButton href="/">
                  <ArrowBackIosNew />
                </IconButton>
              }
              title="Aufgabe"
              subheader={"ID: " + data.id}
            />
            <CardContent
              sx={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <FormControl fullWidth>
                <TextField
                  label="Aufgaben name"
                  defaultValue={data.name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </FormControl>
              <MultiSelectField
                item={kategorie}
                list={tableData.categories}
                label="Kategorien"
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;
                  setKategorie(
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
              />
              <SelectField
                item={bereich}
                list={tableData.bereich}
                label="Bereich"
                onChange={(e) => {
                  setBereich(e.target.value);
                }}
              />
              <SelectField
                item={semester}
                list={tableData.semester}
                label="Semester"
                onChange={(e) => {
                  setSemester(e.target.value);
                }}
              />
            </CardContent>
            <CardActions>
              <FormControl>
                <Button
                  onClick={() => {
                    updateEntry({
                      reference: tableData,
                      id: data.id,
                      name,
                      kategorien: kategorie,
                      bereich,
                      semester,
                    });
                    
                  }}
                >
                  Update
                </Button>
              </FormControl>
            </CardActions>
          </Card>
        </Grid>
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

  /**
   * Holt die Daten der Kategorien für die Tabelle.
   */
  const tableData = await fetch(
    `http://${context.req.headers.host}/api/categories`
  ).then((res) => res.json());

  /**
   * Holt die Daten der Aufgabe.
   * Wenn es die Aufgabe nicht gibt wieder zurück auf die Startseite leiten.
  */
  try {
    if (context.query.id) {
      const data = await pb
        .collection("aufgaben")
        .getOne(context.query.id.toString(), {
          expand: "kategorien,bereich,semester",
        });

      // return props to the page component as props
      return {
        props: {
          data: JSON.parse(JSON.stringify(data)),
          tableData: JSON.parse(JSON.stringify(tableData)),
        },
      };
    }
  } catch (error) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}

interface UpdateEntryProps {
  reference: any;
  id: string;
  name: string;
  kategorien: string[];
  bereich: string;
  semester: string;
}

/**
 * Eintrag aktualisieren
 * @param reference Referenzdaten
 * @param id ID des Eintrags
 * @param name Name des Eintrags
 * @param kategorien Kategorien des Eintrags
 * @param bereich Bereich des Eintrags
 * @param semester Semester des Eintrags
 * @returns redirect zur Startseite
*/
async function updateEntry({
  reference,
  id,
  name,
  kategorien,
  bereich,
  semester,
}: UpdateEntryProps) {
  console.log("Updating entry");
  console.log(reference, id, name, kategorien, bereich, semester);

  // Get the IDs for the categories
  const kategorieIDs = kategorien.map((category) => {
    return reference.categories.find((entry: any) => entry.name === category)
      .id;
  });

  // Get the IDs for the bereich
  const bereichID = reference.bereich.find(
    (entry: any) => entry.name === bereich
  ).id;

  // Get the IDs for the semester
  const semesterID = reference.semester.find(
    (entry: any) => entry.name === semester
  ).id;

  console.log(kategorieIDs, bereichID, semesterID);

  // Update the entry
  try {
    await fetch(
      `${process.env.PocketbaseIP}/api/collections/aufgaben/records/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name,
          bereich: bereichID,
          semester: semesterID,
          kategorien: kategorieIDs,
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );

    // Redirect to home page
    router.push("/", "/", {
      locale: router.locale,
    });
  } catch (error) {
    console.log(error);
  }
}
