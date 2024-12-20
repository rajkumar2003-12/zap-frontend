import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import {Mail} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Follow } from "@/components/Follow";
import { jwtDecode } from "jwt-decode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ZapHeader } from "@/components/ZapHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserDetails {
  id: number;
  username: string;
  name: string;
  email: string;
  avatar?: string; 
}

interface FollowList {
  followersCount: number;
  followingCount: number;
  followersList: UserDetails[];
  followingList:UserDetails[];
}

interface DecodedToken {
  id: number;
}

export function OtherProfile() {
  const location = useLocation();
  const { userId } = location.state || {};
  const [profileData, setProfileData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [UserId, setUserId] = useState<number | null>(null);
  const [UserIdFollowList, setUserIdFollowList] = useState<FollowList | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following' | null>(null);

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
  }, [fetchData,userId]);

  const FollowerFollowingList = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${BASE_URL}/follow/get/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && res.data.followList) {
        setUserIdFollowList(res.data.followList);
        console.log("Follow Lists", res.data.followList);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  useEffect(() => {
    if (userId) {
      FollowerFollowingList();
    }
  }, [FollowerFollowingList,userId]);

  const openDialog = (type: 'followers' | 'following') => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-color1 flex items-center justify-center text-green-900">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (!profileData) {
    return <p>No profile data found.</p>;
  }

  return (
    <div>
      <ZapHeader/>
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
              <div className="text-center" onClick={() => openDialog('followers')}>
                  <p className="text-2xl font-semibold">{UserIdFollowList?.followersCount}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div className="text-center" onClick={() => openDialog('following')}>
                  <p className="text-2xl font-semibold">{UserIdFollowList?.followingCount}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
            </div>
            {UserId !== profileData.id && (
              <Follow UserId={profileData.id}/>
            )}
            <div className="flex items-center text-muted-foreground">
              <Mail className="mr-2 h-4 w-4" />
              <span>{profileData.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>{dialogType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
    </DialogHeader>
    <ul>
      {(dialogType === 'followers' ? UserIdFollowList?.followersList : UserIdFollowList?.followingList)?.map(user => (
        <li key={user.id} className="flex items-center space-x-4 py-2">
          <Avatar className="w-10 h-10">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </li>
      ))}
    </ul>
    <Button onClick={closeDialog}>Close</Button>
  </DialogContent>
</Dialog>
    </div>
  );
}
