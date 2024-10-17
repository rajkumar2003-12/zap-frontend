import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface FollowingProps {
  UserId: number;
}

export function Follow({ UserId }: FollowingProps) {
  const [isFollowing, setIsFollowing] = useState(false); 
  const [loading, setLoading] = useState(true);  


  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No authorization token found.");
          return;
        }

       
        const res = await axios.get(
          `${BASE_URL}/follow/get/${UserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 200) {
          setIsFollowing(res.data.isFollowing); 
          console.log("followfetch",res.data)
        } else {
          console.error("Failed to fetch follow status.");
        }
      } catch (e) {
        console.error("Error fetching follow status: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowStatus();
  }, [UserId]); 


  const handleFollow = async () => {
    setLoading(true); 

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authorization token found.");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/follow/follow-unfollow/${UserId}`,
        {},
        {
          headers: {
            "content-type":"application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setIsFollowing(!isFollowing); 
      } else {
        console.error("Failed to toggle follow status.");
      }
    } catch (e) {
      console.error("Error toggling follow status: ", e);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleFollow} 
          className={`${isFollowing ? "bg-green-800 text-white" : "bg-black text-white"}`}
          disabled={loading} 
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {isFollowing ? "Following" : "Follow"}  
        </Button>
      </div>
    </div>
  );
}
