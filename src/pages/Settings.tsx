import axios from "axios";
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { ZapHeader } from "@/components/ZapHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;


interface ProfileEdit {
  username?: string;
  name?: string;
  email?: string;
  password?: string | number;
}

export function Setting({ username = "", name = "", email = "",password=""}: ProfileEdit) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      username,
      name,
      email,
      password,
    },
  });

  const onSubmit = async (data: ProfileEdit) => {
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No authorization token found.");
        setLoading(false);
        return;
      }

      const res = await axios.put(
        `${BASE_URL}/user/profile-edit`,
        {
          username: data.username,
          name: data.name,
          email: data.email,
          password:data.password
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res && res.status === 200) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating your profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

      <div className="rounded-lg shadow-md w-full min-h-screen">
        <ZapHeader/>
        <Form {...form}>
          <h1 className="text-2xl text-center font-bold mt-3" >Edit your profile</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Please update your username" {...field} />
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
                    <Input placeholder="Please update your name" {...field} />
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
                    <Input placeholder="Please update your email" {...field} />
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
                    <Input placeholder="Please update your new password" {...field} />
                  </FormControl>
                  <FormDescription>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : "Update Profile"}
            </Button>
            </div>
          </form>
        </Form>
      </div>
  );
}
