import DBTable from "@/components/Data/DBTable";
import MultiSelectField from "@/components/Form/MultiSelectField";
import SelectField from "@/components/Form/SelectField";
import Loading from "@/components/Loading/Loading";
import initPocketbase from "@/helpers/initPocketbase";
import { authData } from "@/types/user";
import {
  Avatar,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { Logout, Upload, Password } from "@mui/icons-material";
import { useTheme, alpha } from "@mui/material/styles";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";

/**
 * Gibt eine Abfragezeichenfolge zurück, um Kategorien basierend auf den angegebenen Parametern zu filtern.
 * @param params - Ein Array von Kategorienamen, nach denen gefiltert werden soll.
 * @returns Eine Abfragezeichenfolge im Format "&&({kategorien.name?='${param1}'||kategorien.name?='${param2}'||...})".
 */
function getCategoryParams(params: any[]) {
  if (params.length <= 0) return "";
  const query = params
    .map((param: any) => `kategorien.name?='${param}'`)
    .join("||");
  return `&&(${query})`;
}

/**
 * Gibt eine Abfragezeichenfolge zurück, um Semester basierend auf den angegebenen Parametern zu filtern.
 * @param params - Ein Array von Semester-Strings, nach denen gefiltert werden soll. Jeder String sollte das Format "Semester Jahr" haben, z.B. "Winter 2020".
 * @returns Eine Abfragezeichenfolge im Format "&&((semester.semester='${semester}'&&semester.jahr=${jahr})||(semester.semester='${semester}'&&semester.jahr=${jahr})||...)".
 */
function getSemesterParams(params: any[]) {
  if (params.length <= 0) return "";
  const query = params
    .map((param: string) => {
      let paramArray = param.split(" ");
      return `(semester.semester='${paramArray[0]}'&&semester.jahr=${paramArray[1]})`;
    })
    .join("||");
  return `&&(${query})`;
}

// Fetcher for useSWR
const fetcher = (...args: [RequestInfo, RequestInit?]): Promise<any> => {
  return fetch(...args).then((res: Response) => res.json());
};

export default function Home({
  isLoggedIn,
  authData,
}: {
  isLoggedIn: boolean;
  authData: authData;
}) {
  // Fetch data from api route to build the task table
  const tableData = useSWR("/api/categories", fetcher);
  const theme = useTheme();

  // Searchbar param
  const [query, setQuery] = useState("");
  // Task table params
  const [tasks, setTasks] = useState([]);
  const [taskAmount, setTaskAmount] = useState(30);
  const [maxTasks, setMaxTasks] = useState(-1);
  // Filter params
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBereich, setSelectedBereich] = useState("");
  const [selectedSemester, setSelectedSemester] = useState([]);
  // Loading state
  const [isLoading, setLoading] = useState(true);

  // Profile Icon functions
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /**
   * Behandelt das Klicken auf ein Element und setzt das Anchor-Element entsprechend.
   *
   * @param event - Das Klick-Ereignis.
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Schließt das Anchor-Element.
   */
  const handleClose = () => {
    setAnchorEl(null);
  };

  const matches = useMediaQuery((theme: any) => theme.breakpoints.down("sm"));

  /**
   * Komponente für den "Mehr laden" Button.
   * @returns Die JSX-Elemente für den Button.
   */
  const ShowMoreButton = () => {
    return (
      <Box textAlign="center">
        <Button
          sx={{ width: "20rem", padding: ".75rem" }}
          onClick={() => {
            setTaskAmount(taskAmount + 30);
          }}
        >
          Mehr laden
        </Button>
      </Box>
    );
  };

  /**
   * Sucht nach Aufgaben unter Verwendung des Query-Parameters.
   *
   * @returns {void}
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      // Baut ein URLSearchParams-Objekt auf,
      // das für die Filterung und Abfrage von Daten verwendet wird.
      const params = new URLSearchParams({
        page: "1",
        perPage: taskAmount.toString(),
        expand: "semester,bereich,kategorien,pruefung",
        filter: `name~'${query}'&&bereich.name~'${selectedBereich}'${getSemesterParams(
          selectedSemester
        )}${getCategoryParams(selectedCategories)}`,
      });

      // Fetch Daten von der API Route
      fetch(
        `${process.env.PocketbaseIP}/api/collections/aufgaben/records?${params}`
      )
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // Setzt die Aufgaben und die maximale Anzahl von Aufgaben
          setTasks(data?.items);
          setMaxTasks(data?.totalItems);
          if (data?.items.length < 30) setTaskAmount(30);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 400);

    return () => clearTimeout(timer);
  }, [
    query,
    taskAmount,
    selectedCategories,
    selectedBereich,
    selectedSemester,
  ]);

  // Change semester params when semester is selected
  useEffect(() => {
    getSemesterParams(selectedSemester);
  }, [selectedSemester]);

  // Setzt alle useState Filter zurück
  function clearFilters() {
    setSelectedCategories([]);
    setSelectedBereich("");
    setSelectedSemester([]);
  }

  return (
    <Box>
      {/**
       * Head-Element für die Seite.
       */}
      <AppBar position="sticky">
        <Toolbar sx={{ gap: "1rem" }}>
          <Box sx={{ flexGrow: 1 }} />
          <Paper sx={{ flexGrow: 2 }}>
            <InputBase
              placeholder="Aufgaben suchen"
              sx={{
                padding: "0.3rem",
                width: "100%",
                backgroundColor: alpha(theme.palette.primary.main, 0.25),
              }}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </Paper>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}></Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/**
       * Menü-Element für das Profil Icon im Head-Element.
       */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Avatar /> {authData.username}
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          href="/upload"
          disabled={authData.role == "gast"}
        >
          <ListItemIcon>
            <Upload fontSize="small" />
          </ListItemIcon>
          Upload
        </MenuItem>
        <MenuItem
          component={Link}
          href="/change-password"
          disabled={authData.id == "e1mpp76y4mloqp0"}
        >
          <ListItemIcon>
            <Password fontSize="small" />
          </ListItemIcon>
          Passwort ändern
        </MenuItem>
        <MenuItem component={Link} href="/logout">
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/**
       * Body-Element für die Seite.
       */}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        maxWidth={1200}
        margin="auto"
      >
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" sx={{ margin: "1rem 0" }}>
            Prüfungen
          </Typography>
        </Grid>
        {tableData.data != undefined ? (
          <Grid
            item
            container
            spacing={2}
            sx={{
              padding: "1rem 3rem",
            }}
            direction={matches ? "column" : "row"}
          >
            <Grid item xs={4}>
              <MultiSelectField
                item={selectedCategories}
                list={tableData.data.categories}
                label="Kategorien"
                onChange={(event: any) => {
                  const {
                    target: { value },
                  } = event;
                  setSelectedCategories(
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <SelectField
                item={selectedBereich}
                list={tableData.data.bereich}
                label="Bereich"
                onChange={(event: any) => {
                  setSelectedBereich(event.target.value);
                }}
                nullOption={true}
              />
            </Grid>
            <Grid item xs={4}>
              <MultiSelectField
                item={selectedSemester}
                list={tableData.data.semester}
                label="Semester"
                onChange={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSelectedSemester(
                    typeof value === "string" ? value.split(",") : value
                  );
                }}
              />
            </Grid>
          </Grid>
        ) : null}

        <FilterList
          list={{ selectedCategories, selectedSemester }}
          clearFilters={clearFilters}
        />

        {isLoading || tableData.isLoading ? (
          <Loading />
        ) : (
          <Container className="tableContent">
            <DBTable data={tasks} authData={authData} />
            {tasks.length < maxTasks && ShowMoreButton()}
          </Container>
        )}
      </Grid>
    </Box>
  );
}

/**
 * Komponente für die Filterliste.
 *
 * @param button - Ob der "Clear Filters" Button angezeigt werden soll.
 * @param list - Die Liste der ausgewählten Filter.
 * @param clearFilters - Die Funktion zum Zurücksetzen der Filter.
 * @returns Die JSX-Elemente für die Filterliste.
 */
function FilterList({
  button = true,
  list,
  clearFilters,
}: {
  button?: boolean;
  list: any;
  clearFilters: any;
}) {
  if (list.selectedCategories.length + list.selectedSemester.length <= 0)
    return <Box></Box>;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6">Selected Filters</Typography>
        {button && <Button onClick={clearFilters}>Clear Filters</Button>}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          m: 1,
          gap: ".5rem",
          flexWrap: "wrap",
        }}
      >
        {list.selectedCategories.map((item: string) => {
          return <Chip key={item} label={item} />;
        })}
        {list.selectedSemester.map((item: string) => {
          return <Chip key={item} label={item} />;
        })}
      </Box>
    </Box>
  );
}

/**
 * Überprüft, ob der Benutzer angemeldet ist und leitet ihn gegebenenfalls zu /login um.
 *
 * @param context - Der Kontext der Seite.
 * @returns Die Props für die Seite.
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
