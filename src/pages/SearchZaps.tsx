
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Zap,Home,User} from "lucide-react";
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useState } from 'react';
import { Like } from './LikeReaction';
import { Comments } from '@/components/Comments';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ZapUser{
  id: string;
  username: string;
  name:string;
}

interface Zap {
  id: string;
  title: string;
  content: string;
  author:ZapUser;
}

export function SearchZap() {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchZap = async () => {
    if (!searchTitle) {
      alert('Please enter a Zap title');
      return;
    }

    try {
      const token = localStorage.getItem("authToken")
      const response = await axios.get(
        `${BASE_URL}/zap/search?title=${encodeURIComponent(searchTitle)}`,{
          headers:{
            "Content-Type" : "application/json",
            Authorization : `Bearer ${token}`
          }
        }
      );
      const data = await response.data;
      console.log("all zap user details",data)

      if (data.error) {
        setError(data.error);
        setZaps([]);
      } else if (data.length > 0) {
        setZaps(data);
        setError(null);
      } else {
        setError('No Zaps found with that title.');
        setZaps([]);
      }
    } catch (err: any) {  
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'An unknown error occurred');
        console.log("errors",err.response?.data.error)
      } else {
        setError(err.message || 'An unknown error occurred');
      }
      setZaps([]);
    }
  };


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
            <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
            </Link>
            </div>
            </div>
            </header>
            <div className='text-black text-3xl font-bold text-center mt-4 mb-2 underline decoration-gray-400'>Explore Zap Titles</div>
          <div className="flex items-center gap-4 m-6">
            <Input
              placeholder="Enter Zap Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="flex-1"
            />
            <Button onClick={searchZap}>Search</Button>
          </div>
          
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="max-h-[300px] overflow-y-auto m-4">
              {zaps.map((zap) => (
                <div>
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
                <div key={zap.id} className="border p-4 rounded-lg mb-2">
                  <h3 className="font-bold">{zap.title}</h3>
                  <p className="mt-2">{zap.content}</p>
                  <div className="mt-3 flex space-x-4"> 
                   <Like zapid={Number(zap.id)} />  
                   <Comments zapId={Number(zap.id)} />
                </div>
                </div>
                </div>
              ))}
            </div>
          )}
    </div>
  );
}