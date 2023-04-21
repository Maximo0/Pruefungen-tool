import PocketBase from "pocketbase";

import type { GetServerSidePropsContext } from "next";

export default async function initPocketbase(
  context: GetServerSidePropsContext
) {
  const pb = new PocketBase(process.env.PocketbaseIP);

  pb.authStore.loadFromCookie(context.req?.headers?.cookie || "");

  pb.authStore.onChange(() => {
    context.res?.setHeader("set-cookie", pb.authStore.exportToCookie());
  });

  try {
    pb.authStore.isValid && (await pb.collection("users").authRefresh());
  } catch (_) {
    pb.authStore.clear();
  }

  return pb;
}
