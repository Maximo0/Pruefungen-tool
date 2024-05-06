import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import { ArrowBackIosNew } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Input,
  LinearProgress,
  Modal,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useState, forwardRef, useEffect, use } from "react";

/**
 * Übergang für das Dialogfenster
 */
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Upload({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  const [working, setWorking] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [extract, setExtract] = useState(true);
  const [files, setFiles] = useState<FileList | []>([]);
  const [tasks, setTasks] = useState([]);
  // Progressbar Variables
  const [progress, setProgress] = useState(0);
  const [information, setInformation] = useState("");
  const router = useRouter();

  /**
   * Wenn keine Datei ausgewählt ist, wird der Button deaktiviert
   */
  const isDisabled = () => {
    if (files.length === 0) {
      return true;
    } else {
      return false;
    }
  };
  /**
   * Kümmert sich um die Dateiauswahl und speichert die Dateien in den State
   * @param event
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFiles(event.target.files);
    }

    setExtract(false);
  };

  function handleConfirmOpen() {
    setConfirmOpen(true);
  }
  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  /**
   * Kümmert sich um das Ausführen des Python Scripts
   */
  async function runPython() {
    try {
      console.log("Extracting Tasks from PDFs");
      setWorking(true);

      // Create Form Data to send to the backend
      const fileData = new FormData();
      for (let i = 0; i < files.length; i++) {
        fileData.append("file", files[i]);
      }

      // Send the data to the backend
      axios
        .post("/api/storefiles", fileData, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const eventSource = new EventSource(
            `/api/scripts/runPython?id=${res.data.id}`
          );

          eventSource.onmessage = async (event) => {
            let result = JSON.parse(event.data);

            if (result.type == "progress") {
              setProgress(result.data);
              setInformation(result.current_task);
            } else if (result.type == "result") {
              console.log("Result", result.tasks);
              setTasks(result.tasks);

              await wait(1000);
              setWorking(false);
              setExtract(true);
              setProgress(0);

              eventSource.close();
            }
          };
        })
        .catch((error) => {
          console.log(error);
          setWorking(false);
        });
    } catch (error) {
      console.log(error);
      setWorking(false);
    }
  }

  /**
   * Kümmert sich um das Hochladen der Daten in die Datenbank
   */
  async function uploadToDB() {
    // Close Dialog windows and set working to true
    setConfirmOpen(false);

    console.log("Start uploading to Database");
    try {
      // Create Lists to compare with the database
      const semesters = [
        ...new Set(
          tasks.map((task: any) => {
            return task.semester;
          })
        ),
      ];

      // Loop through all semesters and check if they are already in the database
      semesters.map(async (semester) => {
        // split the semester string into year and season
        const splitString = semester.split(" ");

        // Set Searchparams
        const searchParams = new URLSearchParams({
          filter: `semester~'${splitString[0]}'&&jahr~'${splitString[1]}'`,
        });

        let result = await axios.get(
          `${process.env.PocketbaseIP}/api/collections/semester/records?${searchParams}`
        );

        // If an entry does not exist yet create it
        if (result.data.items.length === 0) {
          const formData = new FormData();
          formData.append("semester", splitString[0]);
          formData.append("jahr", splitString[1]);
          await axios.post(
            `${process.env.PocketbaseIP}/api/collections/semester/records`,
            formData
          );
        }
      });

      // Create List of all test types and Match them to the Database
      const bereiche = [
        ...new Set(
          tasks.map((task: any) => {
            return task.test_type;
          })
        ),
      ];

      // Loop through all test types and check if they are already in the database
      bereiche.map(async (bereich) => {
        // Set Searchparams
        const searchParams = new URLSearchParams({
          filter: `name~'${bereich}'`,
        });

        let result = await axios.get(
          `${process.env.PocketbaseIP}/api/collections/bereich/records?${searchParams}`
        );

        // If an entry does not exist yet create it
        if (result.data.items.length === 0) {
          const formData = new FormData();
          formData.append("name", bereich);
          await axios.post(
            `${process.env.PocketbaseIP}/api/collections/bereich/records`,
            formData
          );
        }
      });

      // Create List of all file paths
      const paths = [
        ...new Set(
          tasks.map((task: any) => {
            return task.file_path;
          })
        ),
      ];

      for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name;

        // Set Searchparams
        const searchParams = new URLSearchParams({
          filter: `name~'${fileName}'`,
        });

        // Check if the file is already in the database
        let result = await axios.get(
          `${process.env.PocketbaseIP}/api/collections/pruefungen/records?${searchParams}`,
          {
            method: "GET",
          }
        );

        let pruefungID = "";
        if (result.data.items.length > 0) {
          pruefungID = result.data.items[0].id;
        }

        // If the file is not in the database, upload it
        if (result.data.items.length === 0) {
          const fileData = new FormData();
          fileData.append("file", files[i]);
          fileData.append("name", files[i].name);

          // Upload the file to the database
          let fileinfo = await axios.post(
            `${process.env.PocketbaseIP}/api/collections/pruefungen/records`,
            fileData,
            {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          pruefungID = fileinfo.data.id;
        }

        // Splice the next five tasks from the tasks array
        let tasksToUpload: any = tasks.splice(0, 5);

        try {
          // Loop Thrugh Tasks and Upload them to the database
          for (let i = 0; i < tasksToUpload.length; i++) {
            const result = await checkExistingTask(tasksToUpload[i]);

            if (result.data.items.length === 0) {
              const taskData = new FormData();
              taskData.append("name", tasksToUpload[i].task);
              taskData.append(
                "bereich",
                await getBereichID(tasksToUpload[i].test_type)
              );
              taskData.append(
                "semester",
                await getSemesterID(tasksToUpload[i].semester)
              );
              taskData.append("pruefung", pruefungID);
              taskData.append("page", tasksToUpload[i].page);

              await axios.post(
                `${process.env.PocketbaseIP}/api/collections/aufgaben/records`,
                taskData
              );
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          router.push("/", "/", {
            locale: router.locale,
          });
        }
      }
      console.log("Upload  Completed");
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Kümmert sich um das Anzeigen der Daten aus der PDF Datei
   * @returns JSX.Element mit den Daten
   */
  const DisplayData = () => {
    let rows = tasks.map((task: any, index: number) => {
      if (index % 5 == 0) {
        return (
          <React.Fragment key={task.test_type + task.semester + Math.random()}>
            <TableRow>
              <TableCell>
                <Typography variant="h6">{files[index / 5].name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{task.task}</TableCell>
              <TableCell>{task.page + 1}</TableCell>
              <TableCell>{task.test_type}</TableCell>
              <TableCell>{task.semester}</TableCell>
            </TableRow>
          </React.Fragment>
        );
      } else {
        return (
          <TableRow
            key={task.page + task.test_type + task.semester + Math.random()}
          >
            <TableCell>{task.task}</TableCell>
            <TableCell>{task.page + 1}</TableCell>
            <TableCell>{task.test_type}</TableCell>
            <TableCell>{task.semester}</TableCell>
          </TableRow>
        );
      }
    });

    return (
      <TableContainer sx={{ maxWidth: "1200px", margin: "1rem auto 0" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Aufgabe</TableCell>
              <TableCell>Seite</TableCell>
              <TableCell>Bereich</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>
    );
  };

  /**
   * Render Funktion des Uploads mit allen Elementen
   */
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
        style={{ minHeight: "100vh" }}
      >
        <Box sx={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
          <Button href="/" sx={{ marginRight: "1rem" }}>
            <ArrowBackIosNew />
            <Typography variant="h5">Zurück</Typography>
          </Button>
          <Input
            type="file"
            inputProps={{ multiple: true, accept: "application/pdf" }}
            onChange={handleFileChange}
          />

          <Button
            variant="contained"
            onClick={runPython}
            disabled={files.length == 0 || working || extract}
          >
            <Typography variant="h5">Extract Tasks</Typography>
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmOpen}
            disabled={tasks.length == 0 || working}
          >
            <Typography variant="h5">Upload</Typography>
          </Button>
        </Box>

        {tasks.length == 0 ? null : <DisplayData />}
      </Grid>

      {/**
       * Dialog Fenster zum Bestätigen des Uploads
       */}
      <Dialog
        open={confirmOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleConfirmClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Sind sie sicher?</DialogTitle>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Nein</Button>
          <Button onClick={uploadToDB}>Ja</Button>
        </DialogActions>
      </Dialog>

      {/**
       * Modal Fenster zum Anzeigen des Upload Fortschritts
       */}
      <Modal open={working}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            backgroundColor: "white",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <Typography variant="h5">
            Die PDFs werden gerade verarbeitet
          </Typography>
          <Box
            sx={{
              padding: "1rem 0",
              width: "100%",
            }}
          >
            <LinearProgress variant="determinate" value={progress} />
          </Box>
          <Typography>{information}</Typography>
        </Box>
      </Modal>
    </>
  );
}

/**
 * Kümmert sich um das Finden der Semester ID
 * @param name Name des Semesters
 * @returns ID des Semesters
 */
async function getSemesterID(name: string) {
  // split the semester string into year and season
  const splitString = name.split(" ");

  // Set Searchparams
  const searchParams = new URLSearchParams({
    filter: `semester~'${splitString[0]}'&&jahr~'${splitString[1]}'`,
  });

  let result = await axios.get(
    `${process.env.PocketbaseIP}/api/collections/semester/records?${searchParams}`
  );

  return result.data.items[0].id;
}

/**
 * Kümmert sich um das Finden der Bereich ID
 * @param name Name des Bereichs
 * @returns ID des Bereichs
 */
async function getBereichID(name: string) {
  // Set Searchparams
  const searchParams = new URLSearchParams({
    filter: `name~'${name}'`,
  });

  let result = await axios.get(
    `${process.env.PocketbaseIP}/api/collections/bereich/records?${searchParams}`
  );

  return result.data.items[0].id;
}

/**
 * Schaut ob die Aufgaben bereits in der Datenbank sind.
 * @param task Handlungsschritte
 * @returns Aufgaben die bereits in der Datenbank sind
 */
async function checkExistingTask(task: any) {
  const searchParams = new URLSearchParams({
    filter: `name~'${task.tasks}'&&bereich~'${await getBereichID(
      task.test_type
    )}'&&semester~'${await getSemesterID(task.semester)}'`,
  });

  let result = await axios.get(
    `${process.env.PocketbaseIP}/api/collections/aufgaben/records?${searchParams}`
  );

  return result;
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

  if (authData.baseModel.role == "gast") {
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

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
