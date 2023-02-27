"use client";
import { Box, FormControl, Input, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Loading from "./loading";
import useSWR from "swr";
import { Container } from "@mui/system";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function TaskPage({ params }) {
  const { data, error, isLoading } = useSWR(
    `http://127.0.0.1:8090/api/collections/aufgaben/records/${params.id}?expand=semester,bereich`,
    fetcher
  );

  console.log(data);

  if (isLoading) return <Loading />;

  return (
    <Container
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h4">{data.id}</Typography>
      <FormControl>
        <Input defaultValue={data.name}></Input>
      </FormControl>
    </Container>
  );
}
