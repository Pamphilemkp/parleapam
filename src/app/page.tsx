"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";



export default function Home() {

  const { data: session, } = authClient.useSession() 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit =  () => {
    authClient.signUp.email({
      name,
      email,
      password,
    }, {
        onSuccess: () => {
            //redirect to the dashboard or sign in page
            window.alert("User created successfully");
        },
        onError: () => {
            // display the error message
            window.alert("Error creating user. Please try again.");
        },
  })};

    const onLogin =  () => {
    authClient.signIn.email({
      email,
      password,
    }, {
        onSuccess: () => {
            //redirect to the dashboard or sign in page
            window.alert("User Login successfully");
        },
        onError: () => {
            // display the error message
            window.alert("Error while login. Please try again.");
        },
  })};

  if(session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <h1 className="text-2xl font-bold">Welcome back! {session.user.name} </h1>
        <Button onClick={() => authClient.signOut()} className="w-full">
          Sign out
        </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-y-10 ">
      <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onSubmit} className="w-full">
          Create User
        </Button>
      </div>

       <div className="p-4 flex flex-col gap-y-4">
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button onClick={onLogin} className="w-full">
          Login 
        </Button>
      </div>
    </div>



  );
}