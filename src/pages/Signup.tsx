import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
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

const BASE_URL = import.meta.env.VITE_BASE_URL;

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function SignUpForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (localStorage.getItem("authToken") != null) {
      navigate("/main");
    }
  })

  const onSubmit = async (data: FormData) => {
    console.log("Submitting data:", data);
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/author/signup`,
        {
          username: data.username,
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Sign up successful!");
        navigate("/signin");
      } else {
        alert("Sign up failed.");
      }
    } catch (e) {
      console.error("Error during sign-up:", e);
      alert("Error during sign-up. Please try again.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen m-4">
      <div className="p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mt-4 text-center mb-4">
        <h1 className="text-2xl text-center font-bold">Create an account</h1>
          <p className="text-sm mb-2">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-500 underline">
              Sign in
            </Link>
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button  className="w-full" type="submit" disabled={loading}>
              {loading ? "Please wait..." : "Sign Up"} 
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
