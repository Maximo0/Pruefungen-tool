import initPocketbase from "@/helpers/initPocketbase";
import { GetServerSidePropsContext } from "next";

export default function LogoutPage() {}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const pb = await initPocketbase(context);

  if (!pb.authStore.isValid) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  pb.authStore.clear();

  context.res?.setHeader("set-cookie", pb.authStore.exportToCookie());

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
