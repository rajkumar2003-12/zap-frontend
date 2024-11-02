import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Mail} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ZapHeader } from "@/components/ZapHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ProfileData {
  id: number;
  username: string;
  name: string;
  email: string;
  followers: number;
  following: number;
  avatar?: string;
}

interface UserIdFollowListData {
  followersCount: number;
  followingCount: number;
  followersList: { id: number; username: string; name: string; avatar?: string }[];
  followingList: { id: number; username: string; name: string; avatar?: string }[];
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'followers' | 'following'>('followers');
  const [UserIdFollowList, setUserIdFollowList] = useState<UserIdFollowListData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${BASE_URL}/user/get-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setProfile(res.data.profile);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        console.log("Error fetching profile:", e);
      }
    }

    fetchData();
  }, []);

  const FollowerFollowingList = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${BASE_URL}/follow/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data && res.data.followList) {
        setUserIdFollowList(res.data.followList);
      }
    } catch (e) {
      console.log("Error fetching follow list:", e);
    }
  };

  const openDialog = (type: 'followers' | 'following') => {
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    if (profile) {
      FollowerFollowingList();
    }
  }, [profile]);

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
      <ZapHeader/>
      <div className="min-h-screen w-full">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={profile.avatar || ""} alt={profile.name} />
                <AvatarFallback>{profile.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
              <p className="text-muted-foreground mb-4">@{profile.username}</p>
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
              <div className="flex items-center text-muted-foreground">
                <Mail className="mr-2 h-4 w-4" />
                <span>{profile.email}</span>
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
                  {/* <Link to="/users" state={{ userId:Number(profile.id)}}> */}
                  <Avatar className="w-10 h-10">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : (
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    )}
                  </Avatar>
                  {/* </Link> */}
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
    </div>
  );
}
