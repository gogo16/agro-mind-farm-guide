
import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, Bell, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-green-800">AgroMind</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              Hartă
            </Button>
            <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              Planificare
            </Button>
            <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              Finanțe
            </Button>
            <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
              Rapoarte
            </Button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-green-700 hover:text-green-800 hover:bg-green-50">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profilul meu
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Setări
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Deconectare
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden text-green-700 hover:text-green-800 hover:bg-green-50">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
