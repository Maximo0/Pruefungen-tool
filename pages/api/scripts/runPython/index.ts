import { NextApiRequest, NextApiResponse } from "next";
import { PythonShell } from "python-shell";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    let paths: string[] = [];

    if (err) throw err;

    for (const file of Object.entries(files.file)) {
      paths.push(file[1].filepath);
    }

    console.log(paths);

    let options = {
      scriptPath: "./scripts/",
      args: paths,
    };

    PythonShell.run("pdf_extractor.py", options)
      .then((result: any) => {
        // console.log("tasks: ", result);
        res.status(200).json({ tasks: result, files: paths });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).end();
      });
  });
}
