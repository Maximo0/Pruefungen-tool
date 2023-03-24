"use client";
import { useState } from "react";
import PocketBase from "pocketbase";
import Papa from "papaparse";
import { useRouter } from "next/navigation";

function createDataReference(data) {
  let referenceData = [];
  if (data[0].collectionName == "semester") {
    data.map((entry) => {
      referenceData.push({
        id: entry.id,
        name: `${entry.jahr} ${entry.semester}`,
      });
    });
  } else {
    data.map((entry) => {
      referenceData.push({ id: entry.id, name: entry.name });
    });
  }
  return referenceData;
}

export default function CreateData() {
  const [csvData, setCsvData] = useState([]);
  const router = useRouter();

  // let uploadButton = (
  //   <button onClick={() => uploadToDB(csvData)}>Upload to DB</button>
  // );
  let uploadButton
  if (csvData.length == 0) {
    uploadButton = null;
  } else {
    uploadButton = (
      <button onClick={() => uploadToDB(csvData)}>Upload to DB</button>
    );
  }

  async function uploadToDB(data) {
    const pb = new PocketBase("http://127.0.0.1:8090");

    let semester = await pb.collection("semester").getFullList(200);
    semester = createDataReference(semester);
    console.log(semester);

    let bereich = await pb.collection("bereich").getFullList(200);
    bereich = createDataReference(bereich);
    console.log(bereich);

    await data.map(async (entry) => {
      // Filter schlechte einträge
      if (entry.length <= 2) return;
      if (entry[0] == null || entry[1] == null || entry[2] == null) return;

      // Sucht nach den richtigen eintrags IDs
      const semester_id = semester.find((o) => o.name == entry[1]).id;
      const bereich_id = bereich.find((o) => o.name == entry[2]).id;

      const record = {
        name: entry[0],
        bereich: bereich_id,
        semester: semester_id,
        kategorien: [],
      };

      // Trägt diese in der Datenbank ein
      await pb.collection("aufgaben").create(record, { $autoCancel: false });
    });
    // redirect user
    router.push("/");
  }

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const files = e.target.files;
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
              complete: (results) => {
                setCsvData(
                  results.data.sort((a, b) => {
                    if (a[1] > b[1]) {
                      return -1;
                    }
                    if (b[1] > a[1]) {
                      return 1;
                    }
                    return 0;
                  })
                );
                console.log(results.data);
              },
            });
          }
        }}
      />

      {uploadButton}
      <hr />
      <table>
        <tbody>
          {csvData.map((entry, index) => {
            if (entry[0] == null) return;
            return (
              <tr key={index}>
                <td>{entry[0]}</td>
                <td>{entry[1]}</td>
                <td>{entry[2]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
