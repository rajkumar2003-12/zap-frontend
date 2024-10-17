import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Zap,Mail,Settings,User,Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Follow } from "@/components/Follow";
import {jwtDecode} from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserDetails {
  id: number;
  username: string;
  name: string;
  email: string;
  followers: number;
  following: number;
  avatar?: string; 
}


interface DecodedToken {
  id: number;
}

export function OtherProfile() {
  const location = useLocation();
  const { userId } = location.state || {};
  const [profileData, setProfileData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [UserId, setUserId] = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token); 
        setUserId(decodedToken.id);
      } else {
        console.error("No token found");
      }
    

      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/user/profile/${userId}`,
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (res.data && res.data.formattedUser) {
        setProfileData(res.data.formattedUser);
        console.log("Profile fetched: ", res.data.formattedUser);
      } else {
        setProfileData(null);
      }
    } catch (e) {
      console.error("Error fetching profile:", e);
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [fetchData, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-color1 flex items-center justify-center text-green-900">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }
  

  if (!profileData) {
    return <p className="flex justify-center min-h-screen bg-color1">User not found.</p>;
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
            <Link to="/main">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 " />
              </Button>
            </Link>
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage
                src={profileData.avatar || ""}
                alt={profileData.name}
              />
              <AvatarFallback>{profileData.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold mb-1">{profileData.name}</h1>
            <p className="text-muted-foreground mb-4">@{profileData.username}</p>
            <div className="flex space-x-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-semibold">{profileData.followers}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold">{profileData.following}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>
            {UserId !== profileData.id && (
              <Follow UserId={userId} />
            )}

            <div className="flex items-center text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{profileData.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
  );
}
