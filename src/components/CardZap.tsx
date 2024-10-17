import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Like } from "@/pages/LikeReaction";
import { Follow } from "./Follow";
import { Comments } from "./Comments";
import {jwtDecode} from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BASE_URL;
interface User{
  id:number;
  name:string;
  username:string;
}
interface Zap {
  id: string;
  title: string;
  content:string;
  updatedAt:string,
  author:User;
}
interface DecodedToken {
  id: number;
}

export function ZapsPage() {
  const [ZapContent, setZapContent] = useState<Zap[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [contentInput, setContentInput] = useState("");
  const [zapCreated, setZapCreated] = useState<number>(0);
  const [UserId , setUserId] = useState<number | null>(null)


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token); 
        setUserId(decodedToken.id);
      } else {
        console.error("No token found");
      }
      setLoading(true);
      const response = await axios.get(
        `${BASE_URL}/zap/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const sortedZaps = response.data.getMany.sort(
        (a: Zap, b: Zap) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      console.log("zapsdetails and user",response.data.getMany)
      setZapContent(sortedZaps); 
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching zaps:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [zapCreated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `${BASE_URL}/zap/create`,
        {
          title: title,
          content: contentInput,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Zap created successfully!");
        setTitle("");
        setContentInput("");
        setZapCreated(zapCreated + 1);
      } else {
        alert("Failed to create zap: " + response.statusText);
      }
    } catch (error) {
      console.error("Error during zap creation:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(
          `Failed to create zap: ${error.response.status} - ${error.response.data}`
        );
      } else {
        alert("Failed to create zap. Please check your network connection.");
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString); 
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString(undefined, options);
  };
 


  if (loading) {
    return (
      <div className="min-h-screen bg-color1 flex items-center justify-center text-green-900">
        <p className="text-xl font-semibold">Loading...</p>
      </div>
    );
  }  

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-full px-6 py-2 rounded-lg border shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-decoration: underline">Create a New Zap</h2>

        <div className="mb-6 w-1/2">
          <label className="block mb-2 font-medium" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="mb-6 my-3">
          <label className="block mb-2 font-medium" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            value={contentInput}
            onChange={(e) => setContentInput(e.target.value)}
            className="w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={6}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-color3 text-white font-semibold rounded-lg hover:bg-black"
        >
          Upload Zap
        </button>
      </form>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-10 px-5 sm:px-5">
        {ZapContent.map((zap) => (
        <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
           <div className="flex items-center bg-color3 hover:bg-black p-4">
          <Link to="/users" state={{ userId:Number(zap.author.id)}}>
            <div className="flex items-center justify-center bg-white text-black rounded-full w-10 h-10 mr-5">
              {zap.author.username.charAt(0).toUpperCase()}
            </div>
        </Link>
        <div>
          <p className="font-semibold text-white">{zap.author?.name || "Anonymous"}</p>
          <p className="text-sm text-white">@{zap.author?.username || "Anonymous"}</p>
        </div>
        </div>
  <div key={zap.id} className="bg-white p-4 sm:p-6">
    <a href="#">
      <h3 className="mt-0.5 text-lg text-gray-900">{zap.title}</h3>
    </a>
    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">{zap.content}</p>
    <time className="block text-xs text-green-600 mt-2">{formatDate(zap.updatedAt)}</time>

    <div className="mt-3 flex space-x-4"> 
    <Like zapid={Number(zap.id)} />  
    <Comments zapId={Number(zap.id)} />
     {UserId !== zap.author.id && (<Follow UserId={Number(zap.author.id)} />)}
  </div>
  </div>
</article>
  ))}
      </div>
    </div>
  );
}
