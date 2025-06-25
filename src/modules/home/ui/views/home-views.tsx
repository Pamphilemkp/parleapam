"use client";
import  { trpc } from "@/trpc/client";



export default function HomeViews() {
 
  // Example: fetch hello data using trpc's hello query
  const { data } = trpc.hello.useQuery({ text: ' Pamphile' });

     return (
      <div className="flex flex-col p-4 gap-y-4">
        <div>{data ? data.greeting : "Loading..."}</div>
      </div>
    );
}