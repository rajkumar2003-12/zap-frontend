import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Comments } from "@/components/Comments";
import { Like } from "./LikeReaction";
import { Follow } from "@/components/Follow";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { Zap} from "lucide-react";
import { ZapHeader } from "@/components/ZapHeader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface UserZap {
    id: number;
    username: string;
    name: string;
}

interface Zap {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: UserZap;
}

interface DecodedToken {
    id: number;
}


export function OpenZap() {
    const location = useLocation();
    console.log("Location state:", location.state);
    const { ZapUserId } = location.state || {};
    const [zapDetail, setZapDetail] = useState<Zap | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("No authentication token found");
                return;
            }
            console.log("id",ZapUserId)
            const decodedToken = jwtDecode<DecodedToken>(token);
            setCurrentUserId(decodedToken.id);

            const response = await axios.get(`${BASE_URL}/zap/get/${ZapUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.ZapUser) {
                setZapDetail(response.data.ZapUser);
                console.log("openzapuser",response.data)
            } else {
                setError("No zap found");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "Failed to fetch zap");
                console.error("Axios error:", error.response);
            } else {
                setError("An unexpected error occurred");
                console.error("Error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [ZapUserId]);

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

    if (isLoading) {
        return <div className="min-h-screen bg-color1 flex items-center justify-center text-green-900">
        <p className="text-xl font-semibold">Loading...</p>
      </div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (!zapDetail) {
        return <div className="text-center p-4">No zap found</div>;
    }

    return (
        <div className=" min-h-screen">
            <ZapHeader/>
          <div className="max-w-3xl mx-auto m-10 px-5">
            <article className="overflow-hidden rounded-lg shadow transition hover:shadow-lg">
                <div className="flex items-center hover:bg-color3 p-4 hover:text-white">
                    <Link to="/users" state={{ userId: zapDetail.author.id }}>
                        <div className="flex items-center justify-center bg-white text-black rounded-full w-10 h-10 mr-5">
                            {zapDetail.author.username.charAt(0).toUpperCase()}
                        </div>
                    </Link>
                    <div>
                        <p className="font-semibold text-black hover:text-white">{zapDetail.author.name || "Anonymous"}</p>
                        <p className="text-sm text-black hover:text-white">@{zapDetail.author.username || "Anonymous"}</p>
                    </div>
                </div>
                    <div className="bg-white p-4 sm:p-6 mt-5">
                    <h3 className="mt-0.5 text-lg text-gray-900">{zapDetail.title}</h3>
                    <div className="mt-2 text-sm/relaxed text-gray-500 whitespace-pre-line">
                        {zapDetail.content}
                    </div>
                    <time className="block text-xs text-green-600 mt-2">
                        {formatDate(zapDetail.updatedAt)}
                    </time>
                    <div className="mt-3 flex space-x-4">
                        <Like zapid={zapDetail.id} />
                        <Comments zapId={zapDetail.id} />
                        {currentUserId !== zapDetail.author.id && (
                            <Follow UserId={zapDetail.author.id} />
                        )}
                    </div>
                </div>
            </article>
        </div>
        </div>
    );
}