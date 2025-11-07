import MagicHomeView from "@/modules/home/ui/views/magic-home-view";
import { GetStarted } from "@/modules/home/ui/components/get-started";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return <GetStarted />;
  }

  return <MagicHomeView />;
}

export default Page;