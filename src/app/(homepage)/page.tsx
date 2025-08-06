import HomeViews from "@/modules/home/ui/views/home-views";
import { GetStarted } from "@/modules/home/ui/components/get-started";
import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import { headers } from "next/headers";


const Page = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return <><GetStarted /></>;
  }

     return (
          <HomeViews />
    );
}

export default Page;