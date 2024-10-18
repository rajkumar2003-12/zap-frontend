import { Avatar,AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent} from "@/components/ui/card";
import { Mail,Zap,Home,Settings ,User} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ProfileData {
  username: string;
  name: string;
  email: string;
  followers: number;
  following: number;
  avatar?:string;
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}/user/get-profile`,{
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProfile(res.data.profile);
        console.log("profiledata",res.data.profile)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        console.log("Error fetching profile:", e);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-color1 flex items-center justify-center text-green-900">
        <p className="text-xl font-semibold">Loading profile...</p>
      </div>
    );
  }
  if (!profile) {
    return <p>No profile data found.</p>;
  }
  return (
    <div>
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
      <div className=" min-h-screen w-full">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={profile.avatar || ""}
                alt={profile.name}
              />
              <AvatarFallback>{profile.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
            <p className="text-muted-foreground mb-4">@{profile.username}</p>
            <div className="flex space-x-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{profile.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{profile.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{profile.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
        </div>
        </div>
  );
}
