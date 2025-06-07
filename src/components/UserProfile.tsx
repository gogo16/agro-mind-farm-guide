
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { User, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserProfile = () => {
  const { user, updateUser } = useAppContext();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
    toast({
      title: "Profil actualizat",
      description: "Informațiile profilului au fost salvate cu succes.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Deconectat",
      description: "Ați fost deconectat cu succes.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5 text-green-700" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profilul meu</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="name">Nume complet</Label>
                <Input
                  id="name"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={editedUser.phone}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="location">Locația</Label>
                <Input
                  id="location"
                  value={editedUser.location}
                  onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="farmName">Numele fermei</Label>
                <Input
                  id="farmName"
                  value={editedUser.farmName}
                  onChange={(e) => setEditedUser({ ...editedUser, farmName: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Anulează
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700">
                  Salvează
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Nume complet</Label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefon</Label>
                  <p className="text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Locația</Label>
                  <p className="text-gray-900">{user.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Numele fermei</Label>
                  <p className="text-gray-900">{user.farmName}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setIsEditing(true)} variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button onClick={handleLogout} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                  <LogOut className="h-4 w-4 mr-2" />
                  Deconectează
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
