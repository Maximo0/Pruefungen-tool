"use client";
import { Input } from "@mui/material";
import { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import JSZip from "jszip";
import Loading from "@/app/loading";

// TODO upload zip and read content

export default function CreateData() {
  const [fileData, setFileData] = useState();
  const output = [];

  useEffect(() => {
    if (fileData) {
      console.log(fileData);
      // for (const file of fileData) {
      //   output.push(<li>{file.name}</li>);
      // }
      uploadToDB()
    }
  }, [fileData]);

  async function uploadToDB() {
    const pb = new PocketBase("http://127.0.0.1:8090");
    for (let file of fileData) {
      let formData = new FormData();
      formData.append("file", file);
      const upload = await pb.collection("pruefungen").create(formData);
      console.log(upload.file);
    }
    console.log("Uploaded!");
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            setFileData(files);
          }
        }}
        webkitdirectory=""
        multiple
      />
      <ul>{output}</ul>
    </div>
  );
}
