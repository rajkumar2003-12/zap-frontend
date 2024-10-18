import { Link,useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios"; 
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

interface SignInFormData {
  email: string;
  password: string;
}

export function SignInForm() {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate(); 
  const [Loading, setLoading] =useState(false)

  useEffect(() => {
    if (localStorage.getItem("authToken") != null) {
      navigate("/main");
    }
  })

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true)
    try {
      const response = await axios.post(`${BASE_URL}/author/signin`,{
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const token = response.data.token;
      localStorage.setItem("authToken", token);
        navigate("/main");
      }
    } catch (e) {
      console.error("Error during sign-in:", e);
      alert("Wrong password or email");
    }finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen m-4">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md">
      <div className="text-center mb-4">
      <h1 className="text-2xl text-center font-bold">Sign in</h1>
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 underline">
              Sign up
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={Loading}>{Loading? "please wait...": "sign in"}</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
