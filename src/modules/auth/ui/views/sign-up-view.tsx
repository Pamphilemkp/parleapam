"use client";
import {z} from "zod";
import {OctagonAlertIcon} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form"; // ✅ your custom Form wrapper with FormProvider
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";



const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password must be at least 6 characters long" }),
    ConfirmPassword: z.string().min(1, { message: "Confirm Password is required" })
}).refine((data) => data.password === data.ConfirmPassword, {
    message: "Passwords do not match",
    path: ["ConfirmPassword"],
});
  

export const SignUpView = () => {

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();  
const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),  defaultValues: {
      name: "",
      email: "",
      password: "",
      ConfirmPassword: ""
    },  
    });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/",
    }, {
      onSuccess: () => {
        // Redirect to the dashboard or home page
        setPending(false);
       router.push("/");
      },
      onError: ({error}) => {
        setPending(false);
        setError(error.message);
      }, 
    });
  }


  const onSocial = (provider: "github"|"google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social({
      provider: provider,
      callbackURL: "/",
    }, {
      onSuccess: () => {
        // Redirect to the dashboard or home page
        setPending(false);
        router.push("/");
      },onError: ({error}) => {
        setPending(false);
        setError(error.message);
      }, 
    });
  }

  return (
    <div className="w-full flex flex-col gap-6">
     <Card className="overflow-hidden p-0">
       <CardContent className="grid p-0 md:grid-cols-2">
         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                  <p className="text-muted-foreground text-balance">Create your account</p>
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Mkp Chill"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="chilltechacademy@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="ConfirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                    <AlertTitle>{error}</AlertTitle>
                  </Alert>
                )}

                <Button
                 disabled={pending}
                 type="submit"
                 className="w-full bg-green-700 hover:bg-green-800">
                  Sign Up
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-0.5 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                  onClick={() => onSocial("google")}
                   disabled={pending}
                   variant="outline"
                   type="button" 
                   className="w-full bg-white hover:bg-gray-100">
                    <FaGoogle className="inline-block mr-2" />
                    Google
                  </Button>
                  <Button 
                  disabled={pending}
                  onClick={() => onSocial("github")}
                  variant="outline" 
                  type="button" 
                  className="w-full bg-white hover:bg-gray-100">
                    <FaGithub className="inline-block mr-2" />
                    GitHub
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="sign-in" className="underline under">
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
         </Form>

         <div className="bg-radial from-green-700 to-green-900 relative hidden md:flex flex-col  items-center justify-center gap-y-4">
           <Image src="/google.svg" alt="Google" width={16} height={16} className="mr-2" />
            <p className="text-2xl text-white font-semibold ">
                Talk To Pams Ai
            </p>
         </div>
       </CardContent>
     </Card>
     <div className="text-muted-foreground *:[a]:hover:text-primary text-xs text-balance *:[a]:hover:underline *:[a]:hover:underline-offset-4 text-center">
      By clicking continue, you agree to our{" "}
        <Link href="#" className="underline">Terms of Service</Link> and{" "}
        <Link href="#" className="underline">Privacy Policy</Link>.  
     </div>
    </div>
  );
}   

