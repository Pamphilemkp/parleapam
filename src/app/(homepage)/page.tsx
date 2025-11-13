import MagicHomeView from "@/modules/home/ui/views/magic-home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/agents");
  }

  return <MagicHomeView />;
};

export default Page;