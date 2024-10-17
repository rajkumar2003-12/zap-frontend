import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

interface ZapId {
  zapid: number;
}

export function Like({ zapid }: ZapId) {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(
          `https://backend.anumularajkumar2003.workers.dev/likes/get/${zapid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setLiked(res.data.isLiked);
          setLikes(res.data.likesCount);
          console.log("likesproccess",res.data)
        }
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [zapid]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `https://backend.anumularajkumar2003.workers.dev/likes/like-unlike/${zapid}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        if (res.data.action === "liked") {
          setLikes((prevLikes) => prevLikes + 1);
          setLiked(true); 
        } else if (res.data.action === "unliked") {
          setLikes((prevLikes) => prevLikes - 1);
          setLiked(false);
        }
      } else {
        console.error("Failed to toggle like status. Response:", res.data);
      }
    } catch (e) {
      console.error("Error liking/unliking zap:", e);
    }
  };

  return (
    <div>
      <Button variant="outline" size="sm" onClick={handleLike}>
        <Heart className={`h-4 w-4 mr-2 ${liked ? "text-red-600" : ""}`} /> 
        {likes}
      </Button>
    </div>
  );
}
