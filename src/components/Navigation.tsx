
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Bell, 
  Menu,
  Settings,
  FileStack,
  Package
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications] = useState(3);

  const menuItems = [
    { icon: Home, label: 'Acasă', path: '/' },
    { icon: MapPin, label: 'Hartă', path: '/map' },
    { icon: Calendar, label: 'Planificare', path: '/planning' },
    { icon: DollarSign, label: 'Finanțe', path: '/finance' },
    { icon: FileText, label: 'Rapoarte', path: '/reports' },
    { icon: FileStack, label: 'Documente', path: '/modules' },
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-green-700" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-green-700" />
            </Button>

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
