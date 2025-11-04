import ModernHomeView from "@/modules/home/ui/views/modern-home-view";
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

  return <ModernHomeView />;
}

export default Page;