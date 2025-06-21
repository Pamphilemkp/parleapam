import HomeViews from "@/modules/home/ui/views/home-views";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";


const Page = async () => {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

     return (
      <HomeViews />
    );
}

export default Page;