import PocketBase from "pocketbase";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const pb = new PocketBase(process.env.PocketbaseIP);
  pb.authStore.loadFromCookie(req.headers.cookie || "");

  const authData = JSON.parse(JSON.stringify(pb.authStore));
  const data = JSON.parse(req.body);
  
  
  try {
    const updatedUser = await pb.collection("users").update(authData.baseModel.id, data)

    res.status(200).json({updatedUser})
  } catch (error) {
    console.log(error);
    res.status(400).json(error)
  }
}
