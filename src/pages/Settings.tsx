import axios from "axios";
import { useState } from "react";
import { Zap,Home,User,Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;


interface ProfileEdit {
  username?: string;
  name?: string;
  email?: string;
  password?: string | number;
}

export function Setting({ username = "", name = "", email = "",password=""}: ProfileEdit) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/signin'); 
  };

  return (

      <div className="bg-color1 rounded-lg shadow-md w-full min-h-screen">
      <header className="bg-color2 sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-3xl font-bold flex items-center">
            <Zap className="h-8 w-8 mr-2 animate-pulse" />
                Zap
            </h1>
            <div className="flex space-x-4">
            <Link to = "/main">
                <Button variant="ghost" size="icon"><Home className="h-5 w-5" /></Button>
            </Link>
            <Link to="/settings">
            <Button variant="ghost" size="icon"><Settings className="h-5 w-5 " /></Button>
            </Link>
            <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
            </Link>
            </div>
            </div>
            </header>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ml-5 mt-5">
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
                    This will be your display name.
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
                    Please enter your name.
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
                    Please update your email address.
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
                    <Input placeholder="Enter your new password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please update your password.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-5" disabled={loading}>
              {loading ? "Please wait..." : "Update Profile"}
            </Button>

            <div>
              <button className="text-red-800 text-decoration: underline bg-white px-4 py-1 ml-5 mb-2 hover:bg-black hover:text-red-900 rounded"
              onClick={handleLogout}>Log out</button>
             
            </div>
          </form>
        </Form>
      </div>
  );
}
