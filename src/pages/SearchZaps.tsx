import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface Zap {
  id: string;
  title: string;
  content: string;
}

export function SearchZap() {
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [zaps, setZaps] = useState<Zap[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Zaps</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
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
            <div className="max-h-[300px] overflow-y-auto">
              {zaps.map((zap) => (
                <div key={zap.id} className="border p-4 rounded-lg mb-2">
                  <h3 className="font-bold">{zap.title}</h3>
                  <p className="mt-2">{zap.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}