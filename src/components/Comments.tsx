import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface User {
  username: string;
}

interface CommentsGet {
  id: number;
  content: string;
  user: User;
}

interface CommentInputProps {
  zapId: number;
}

export function Comments({ zapId }: CommentInputProps) {
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<CommentsGet[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

 
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `https://backend.anumularajkumar2003.workers.dev/comment/get/${zapId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const fetchedComments = res.data.getMany || []; 
      setComments(fetchedComments);
      setCommentCount(fetchedComments.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [zapId]);

 
  const CommentHandle = async () => {
    if (!zapId) {
      alert("No zap selected");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "https://backend.anumularajkumar2003.workers.dev/comment/create",
        {
          content: commentInput,
          zapid: zapId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully commented");
        setCommentInput("");
        fetchComments(); 
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            {commentCount}
          </Button>
        </DialogTrigger>

        <DialogContent aria-describedby="dialog-description">
          <DialogHeader>
            <DialogTitle>Comments Section</DialogTitle>
            <DialogDescription id="dialog-description">
              Here you can view and add comments to this post.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-200 pb-2 mb-2"
                >
                  <p>
                    <strong>{comment.user.username}:</strong>{" "}
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments available.</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your comment..."
            />
            <Button onClick={CommentHandle} className="mt-2">
              Submit Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
