"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";



export default function HomeViews() {
const {data: session} = authClient.useSession();
const router = useRouter();

     return (
      <div className="flex flex-col p-4 gap-y-4">
        <h1 className="text-2xl font-bold">Welcome back! {session?.user?.name ?? "Guest"} </h1>
        <Button onClick={
            () => authClient.signOut(
                {fetchOptions: 
                    { onSuccess:
                         ()=> router.push("sign-in")
                        }})}
        className="w-full">
          Sign out
        </Button>
      </div>
    );
}