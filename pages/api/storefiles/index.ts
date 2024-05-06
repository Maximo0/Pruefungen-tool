import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
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

    try {
      axios
        .post(
          `${process.env.PocketbaseIP}/api/collections/uploadStorage/records`,
          { paths }
        )
        .then((response) => {
          res.status(200).json(response.data);
        });
    } catch (error) {
      res.status(500).json({ error: "Error uploading file path" });
    }
  });
}
