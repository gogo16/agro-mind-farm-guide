
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Menu,
  FileStack,
  Package,
  FolderOpen
} from 'lucide-react';
import NotificationCenter from './NotificationCenter';
import UserProfile from './UserProfile';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshRecommendations, isLoading: aiLoading } = useAIRecommendations();

  const menuItems = [
    { icon: Home, label: 'Acasă', path: '/' },
    { icon: MapPin, label: 'Hartă', path: '/map' },
    { icon: Calendar, label: 'Planificare', path: '/planning' },
    { icon: DollarSign, label: 'Finanțe', path: '/finance' },
    { icon: FileText, label: 'Documente', path: '/documents' },
    { icon: FileStack, label: 'APIA/AFIR', path: '/modules' },
    { icon: Package, label: 'Inventar', path: '/inventory' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="bg-green-600 text-white p-2 rounded-lg">
              <span className="font-bold text-lg">🌱</span>
            </div>
            <span className="font-bold text-xl text-green-800">AgroMind</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                className={`flex items-center space-x-2 ${
                  isActive(item.path) 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'text-green-700 hover:text-green-800 hover:bg-green-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            <Button 
              onClick={refreshRecommendations}
              disabled={aiLoading}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 h-8 w-8 p-0"
              title="Refresh AI"
            >
              🔄
            </Button>
            <NotificationCenter />
            <UserProfile />

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-6">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "default" : "ghost"}
                      className={`flex items-center space-x-2 justify-start ${
                        isActive(item.path) 
                          ? 'bg-green-600 text-white' 
                          : 'text-green-700 hover:text-green-800'
                      }`}
                      onClick={() => navigate(item.path)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
