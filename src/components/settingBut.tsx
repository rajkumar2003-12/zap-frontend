import { useState } from 'react';
import { Button } from './ui/button';
import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function SettingsMenu(){
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/signin'); 
  };
  return (
    <div className="relative inline-block text-left">
      {/* Settings Button */}
      <button
        onClick={toggleMenu}><Button variant="ghost" size="icon"><Settings className="h-5 w-5 " /></Button></button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
            <Link to="/settings">
          <button
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={() => console.log('Edit Profile clicked')}>Edit Profile</button>
          </Link>
          <button
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

