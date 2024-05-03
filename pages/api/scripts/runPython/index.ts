import { NextApiRequest, NextApiResponse } from "next";
import { PythonShell } from "python-shell";
import axios from "axios";

export const dynamic = "force-dynamic";

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Sammelt alle PDFs und führt das Python Script aus um die Daten zu extrahieren
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).setHeader("Content-Type", "text/event-stream");
  res.setHeader("Content-Encoding", "none");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Speichert die ID vom request.query Objekt
  const id = req.query.id;

  // Besorgt sich die Datei Pfade aus der Datenbank
  let paths = await axios
    .get(
      `${process.env.PocketbaseIP}/api/collections/uploadStorage/records/${id}`
    )
    .then((response) => {
      return response.data.paths;
    });

  // Options für Python-Shell
  let options = {
    scriptPath: "./scripts/",
    args: paths,
    pythonOptions: ["-u"],
  };

  let pyshell = new PythonShell("pdf_extractor.py", options);

  // Wenn eine Nachricht vom Python-Script kommt
  pyshell.on("message", function (event) {
    let output = JSON.parse(event);

    if (output.type == "progress") {
      res.write(`data: ${JSON.stringify(output)}\n\n`);
    } else if (output.type == "result") {
      res.write(
        `data: ${JSON.stringify({
          type: output.type,
          tasks: output.data,
          files: paths,
        })}\n\n`
      );
      axios.delete(
        `http://localhost:8090/api/collections/uploadStorage/records/${id}`
      );
      res.end();
    }
  });

  // Error
  pyshell.end(function (err, code, signal) {
    if (err) {
      console.error(err);
      res.status(200).end();
    }
  });

  req.on("close", () => {
    res.end();
  });
}
