
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { User, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const profileSchema = z.object({
  first_name: z.string().min(2, 'Prenumele trebuie să aibă cel puțin 2 caractere'),
  last_name: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  farm_name: z.string().optional(),
  county: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      farm_name: profile?.farm_name || '',
      county: profile?.county || '',
      phone: profile?.phone || '',
    },
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        farm_name: profile.farm_name || '',
        county: profile.county || '',
        phone: profile.phone || '',
      });
    }
  }, [profile, form]);

  const handleSave = async (data: ProfileFormData) => {
    setIsLoading(true);
    const { error } = await updateProfile(data);
    
    if (!error) {
      setIsEditing(false);
    } else {
      toast({
        title: "Eroare",
        description: "Nu s-a putut actualiza profilul. Încearcă din nou.",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Deconectat",
        description: "Ați fost deconectat cu succes.",
      });
      navigate('/login');
    }
  };

  if (!user) {
    return null;
  }

  const displayName = profile 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email
    : user.email;

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prenume</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="farm_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numele fermei</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Județ</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    onClick={() => setIsEditing(false)} 
                    variant="outline" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    Anulează
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Se salvează...' : 'Salvează'}
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Nume complet</Label>
                  <p className="text-gray-900">{displayName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                {profile?.farm_name && (
                  <div>
                    <Label className="text-sm font-medium">Numele fermei</Label>
                    <p className="text-gray-900">{profile.farm_name}</p>
                  </div>
                )}
                {profile?.county && (
                  <div>
                    <Label className="text-sm font-medium">Județ</Label>
                    <p className="text-gray-900">{profile.county}</p>
                  </div>
                )}
                {profile?.phone && (
                  <div>
                    <Label className="text-sm font-medium">Telefon</Label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                )}
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
