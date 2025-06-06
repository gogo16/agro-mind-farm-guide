
import React from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Plus, FileText, PieChart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Finance = () => {
  const financialData = {
    totalBudget: 150000,
    spent: 89500,
    income: 125000,
    profit: 35500
  };

  const expenses = [
    { category: 'Semințe', amount: 25000, percentage: 28, color: 'bg-blue-500' },
    { category: 'Îngrășăminte', amount: 18500, percentage: 21, color: 'bg-green-500' },
    { category: 'Tratamente', amount: 15000, percentage: 17, color: 'bg-yellow-500' },
    { category: 'Combustibil', amount: 12000, percentage: 13, color: 'bg-red-500' },
    { category: 'Utilaje', amount: 10000, percentage: 11, color: 'bg-purple-500' },
    { category: 'Altele', amount: 9000, percentage: 10, color: 'bg-gray-500' }
  ];

  const transactions = [
    {
      id: 1,
      type: 'expense',
      description: 'Semințe grâu - Glosa',
      amount: 8500,
      date: '2024-06-05',
      category: 'Semințe',
      field: 'Parcela Nord'
    },
    {
      id: 2,
      type: 'income',
      description: 'Vânzare porumb 2023',
      amount: 45000,
      date: '2024-06-03',
      category: 'Vânzări',
      field: 'Câmp Sud'
    },
    {
      id: 3,
      type: 'expense',
      description: 'Îngrășământ NPK',
      amount: 3200,
      date: '2024-06-01',
      category: 'Îngrășăminte',
      field: 'Livada Est'
    }
  ];

  const fieldProfitability = [
    { field: 'Parcela Nord', revenue: 48000, costs: 32000, profit: 16000, margin: 33.3 },
    { field: 'Câmp Sud', revenue: 42000, costs: 28500, profit: 13500, margin: 32.1 },
    { field: 'Livada Est', revenue: 35000, costs: 29000, profit: 6000, margin: 17.1 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Gestiune Financiară</h1>
          <p className="text-green-600">Monitorizează bugetul și profitabilitatea fermei</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Buget Total</p>
                  <p className="text-2xl font-bold text-green-800">{financialData.totalBudget.toLocaleString()} RON</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600 font-medium">Cheltuieli</p>
                  <p className="text-2xl font-bold text-red-800">{financialData.spent.toLocaleString()} RON</p>
                  <p className="text-xs text-gray-500">{((financialData.spent / financialData.totalBudget) * 100).toFixed(1)}% din buget</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Venituri</p>
                  <p className="text-2xl font-bold text-blue-800">{financialData.income.toLocaleString()} RON</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 font-medium">Profit</p>
                  <p className="text-2xl font-bold text-emerald-800">{financialData.profit.toLocaleString()} RON</p>
                  <p className="text-xs text-gray-500">Marjă {((financialData.profit / financialData.income) * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px] bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Prezentare</TabsTrigger>
            <TabsTrigger value="expenses">Cheltuieli</TabsTrigger>
            <TabsTrigger value="profitability">Profitabilitate</TabsTrigger>
            <TabsTrigger value="reports">Rapoarte</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Expense Breakdown */}
              <Card className="bg-white border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Distribuția cheltuielilor</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded ${expense.color}`}></div>
                        <span className="text-sm font-medium">{expense.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{expense.amount.toLocaleString()} RON</p>
                        <p className="text-xs text-gray-500">{expense.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-white border-green-200">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-green-800">Tranzacții recente</CardTitle>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-600">{transaction.field} • {transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()} RON
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profitability" className="space-y-6">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">Profitabilitate pe parcele</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Parcela</th>
                        <th className="text-right p-3">Venituri</th>
                        <th className="text-right p-3">Costuri</th>
                        <th className="text-right p-3">Profit</th>
                        <th className="text-right p-3">Marjă %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fieldProfitability.map((field) => (
                        <tr key={field.field} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{field.field}</td>
                          <td className="p-3 text-right text-green-600">
                            {field.revenue.toLocaleString()} RON
                          </td>
                          <td className="p-3 text-right text-red-600">
                            {field.costs.toLocaleString()} RON
                          </td>
                          <td className="p-3 text-right font-semibold">
                            {field.profit.toLocaleString()} RON
                          </td>
                          <td className="p-3 text-right">
                            <Badge className={`${
                              field.margin > 30 ? 'bg-green-100 text-green-800' :
                              field.margin > 20 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {field.margin.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <FileText className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 mb-2">Raport lunar</h3>
                  <p className="text-sm text-gray-600 mb-4">Analiza financiară detaliată pentru luna curentă</p>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Generează PDF
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <PieChart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 mb-2">Analiza costurilor</h3>
                  <p className="text-sm text-gray-600 mb-4">Comparația cheltuielilor pe categorii</p>
                  <Button size="sm" variant="outline">
                    Vezi detalii
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-800 mb-2">Prognoză profit</h3>
                  <p className="text-sm text-gray-600 mb-4">Estimări pentru sezonul curent</p>
                  <Button size="sm" variant="outline">
                    Vezi prognoze
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
