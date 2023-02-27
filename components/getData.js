import PocketBase from "pocketbase";

const getPruefungen = async () => {
  const db = new PocketBase("http://127.0.0.1:8090");
  const data = await db
    .collection("aufgaben")
    .getList(1, 25, { expand: "kategorie, pruefung" });
  return data?.items;
};

export default getPruefungen;