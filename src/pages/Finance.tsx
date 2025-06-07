import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, TrendingDown, Calculator, Plus, ArrowUpRight, ArrowDownRight, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

const Finance = () => {
  const { toast } = useToast();
  const { transactions, fields, addTransaction, updateTransaction, deleteTransaction } = useAppContext();
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: '',
    amount: '',
    description: '',
    category: '',
    field: '',
    date: ''
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpenses;

  const handleAddTransaction = () => {
    if (!newTransaction.type || !newTransaction.amount || !newTransaction.description) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi toate câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    addTransaction({
      type: newTransaction.type as 'income' | 'expense',
      amount: parseFloat(newTransaction.amount),
      description: newTransaction.description,
      category: newTransaction.category || 'General',
      field: newTransaction.field || 'General',
      date: newTransaction.date || new Date().toISOString().split('T')[0]
    });

    setNewTransaction({ type: '', amount: '', description: '', category: '', field: '', date: '' });
    setIsAddingTransaction(false);

    toast({
      title: "Succes",
      description: "Tranzacția a fost adăugată cu succes.",
    });
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction({ ...transaction });
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction.description || !editingTransaction.amount) {
      toast({
        title: "Eroare",
        description: "Te rugăm să completezi câmpurile obligatorii.",
        variant: "destructive"
      });
      return;
    }

    updateTransaction(editingTransaction.id, {
      ...editingTransaction,
      amount: parseFloat(editingTransaction.amount)
    });

    toast({
      title: "Succes",
      description: "Tranzacția a fost actualizată cu succes.",
    });

    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
    deleteTransaction(id);
    toast({
      title: "Tranzacție ștersă",
      description: "Tranzacția a fost ștersă cu succes.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Management Financiar</h1>
          <p className="text-green-600">Monitorizează performanța financiară a fermei tale</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium mb-1">Venituri totale</p>
                  <p className="text-2xl font-bold text-green-800">{totalIncome.toLocaleString()} RON</p>
                  <p className="text-xs text-green-600 mt-1">+12% față de luna trecută</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium mb-1">Cheltuieli totale</p>
                  <p className="text-2xl font-bold text-red-800">{totalExpenses.toLocaleString()} RON</p>
                  <p className="text-xs text-red-600 mt-1">+5% față de luna trecută</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Profit net</p>
                  <p className="text-2xl font-bold text-blue-800">{profit.toLocaleString()} RON</p>
                  <p className="text-xs text-blue-600 mt-1">Marjă: {totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0}%</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium mb-1">ROI estimat</p>
                  <p className="text-2xl font-bold text-purple-800">
                    {totalExpenses > 0 ? ((profit / totalExpenses) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Return on Investment</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transactions */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-green-800">Tranzacții recente</CardTitle>
                <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-1" />
                      Adaugă
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adaugă tranzacție nouă</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="type">Tip tranzacție *</Label>
                        <Select onValueChange={(value) => setNewTransaction({...newTransaction, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează tipul" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income">Venit</SelectItem>
                            <SelectItem value="expense">Cheltuială</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="amount">Sumă (RON) *</Label>
                        <Input
                          id="amount"
                          type="number"
                          value={newTransaction.amount}
                          onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                          placeholder="ex: 1500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Descriere *</Label>
                        <Input
                          id="description"
                          value={newTransaction.description}
                          onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                          placeholder="ex: Îngrășământ NPK"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categorie</Label>
                        <Select onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Fertilizatori">Fertilizatori</SelectItem>
                            <SelectItem value="Tratamente">Tratamente</SelectItem>
                            <SelectItem value="Combustibil">Combustibil</SelectItem>
                            <SelectItem value="Vânzări">Vânzări</SelectItem>
                            <SelectItem value="Utilaje">Utilaje</SelectItem>
                            <SelectItem value="Altele">Altele</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="field">Teren</Label>
                        <Select onValueChange={(value) => setNewTransaction({...newTransaction, field: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selectează terenul" />
                          </SelectTrigger>
                          <SelectContent>
                            {fields.map((field) => (
                              <SelectItem key={field.id} value={field.name}>{field.name}</SelectItem>
                            ))}
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newTransaction.date}
                          onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => setIsAddingTransaction(false)} variant="outline" className="flex-1">
                          Anulează
                        </Button>
                        <Button onClick={handleAddTransaction} className="flex-1 bg-green-600 hover:bg-green-700">
                          Adaugă tranzacție
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactions.slice(0, 8).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{transaction.category}</Badge>
                          <span className="text-xs text-gray-500">{transaction.field}</span>
                          <span className="text-xs text-gray-500">{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} RON
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleEditTransaction(transaction)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ești sigur că vrei să ștergi această tranzacție?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Această acțiune nu poate fi anulată. Tranzacția "{transaction.description}" va fi ștersă permanent.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anulează</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTransaction(transaction.id)} className="bg-red-600 hover:bg-red-700">
                              Șterge definitiv
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Budget */}
          <div className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Buget lunar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cheltuieli planificate</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">18.750 / 25.000 RON</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Venituri estimate</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">12.000 / 20.000 RON</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardHeader>
                <CardTitle>💡 Sfaturi financiare</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Optimizare costuri</p>
                  <p className="text-xs">
                    Cheltuielile cu fertilizatorii au crescut cu 15%. Consideră furnizori alternativi.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Oportunitate vânzare</p>
                  <p className="text-xs">
                    Prețul porumbului a crescut cu 8%. Momentul ideal pentru vânzare.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Transaction Dialog */}
      {editingTransaction && (
        <Dialog open={true} onOpenChange={() => setEditingTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editează tranzacția</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Descriere</Label>
                <Input
                  value={editingTransaction.description}
                  onChange={(e) => setEditingTransaction({...editingTransaction, description: e.target.value})}
                />
              </div>
              <div>
                <Label>Sumă (RON)</Label>
                <Input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) => setEditingTransaction({...editingTransaction, amount: e.target.value})}
                />
              </div>
              <div>
                <Label>Categorie</Label>
                <Select onValueChange={(value) => setEditingTransaction({...editingTransaction, category: value})} value={editingTransaction.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fertilizatori">Fertilizatori</SelectItem>
                    <SelectItem value="Tratamente">Tratamente</SelectItem>
                    <SelectItem value="Combustibil">Combustibil</SelectItem>
                    <SelectItem value="Vânzări">Vânzări</SelectItem>
                    <SelectItem value="Utilaje">Utilaje</SelectItem>
                    <SelectItem value="Altele">Altele</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => setEditingTransaction(null)} variant="outline" className="flex-1">
                  Anulează
                </Button>
                <Button onClick={handleUpdateTransaction} className="flex-1 bg-green-600 hover:bg-green-700">
                  Salvează modificările
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Finance;
