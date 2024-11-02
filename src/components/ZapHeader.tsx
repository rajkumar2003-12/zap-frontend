
import { Zap,Home,User,Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SettingsMenu } from "@/components/settingBut";

export function ZapHeader(){
    return (
        <div className="sticky top-0 z-10 bg-color1">
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
            <Link to ="/search">
            <Button variant="ghost" size="icon"><Search className="h-5 w-5 " /></Button>
            </Link>
            <SettingsMenu/>
            <Link to="/profile">
                <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
            </Link>
            </div>
            </div>
            </header>
        </div>
    )
}