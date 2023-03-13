"use client";
import { use, useEffect } from "react";
import useSWR from "swr";

const preLoad = fetch("http://localhost:3000/api/categories").then((res) => res.json());

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function test() {
  // const {data, error, isLoading} = useSWR("http://localhost:3000/api/", fetcher)

  const data = use(preLoad);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div>
      <h1>Testing Page</h1>
      <pre>{JSON.stringify(data, 2, 2)}</pre>
    </div>
  );
}
