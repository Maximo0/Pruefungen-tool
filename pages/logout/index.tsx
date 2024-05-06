import initPocketbase from "@/helpers/initPocketbase";
import { GetServerSidePropsContext } from "next";

export default function LogoutPage() {}

/**
 * Leeren des AuthStore und Weiterleitung auf die Login-Seite
*/
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

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
