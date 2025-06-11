
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Users, Minus, Plus, Sparkles } from 'lucide-react';

interface Currency {
  code: string;
  symbol: string;
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'UAH', symbol: '₴' },
  { code: 'PLN', symbol: 'zł' },
];

export default function TipSplitPage() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);

  const [quote, setQuote] = useState<string>('');
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  const [tipPerPerson, setTipPerPerson] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);

  const calculateTotals = useCallback(() => {
    const bill = parseFloat(billAmount);
    const tip = tipPercentage;
    const people = numberOfPeople;

    if (isNaN(bill) || bill <= 0 || isNaN(tip) || tip < 0 || isNaN(people) || people < 1) {
      setTipPerPerson(0);
      setTotalPerPerson(0);
      return;
    }

    const totalTipAmount = bill * (tip / 100);
    const finalBill = bill + totalTipAmount;

    setTipPerPerson(totalTipAmount / people);
    setTotalPerPerson(finalBill / people);
  }, [billAmount, tipPercentage, numberOfPeople]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const programmingQuotes = [ 
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Programming is the art of algorithmic thinking. - Unknown",
    "Software is a great combination of artistry and engineering. - Bill Gates",
    "The most effective way to achieve it is to do it. - Amelia Earhart (applicable to coding!)",
    "Code is like humor. When you have to explain it, it’s bad. - Cory House",
    "The function of good software is to make the complex appear simple. - Grady Booch",
    "Walking on water and developing software from a specification are easy if both are frozen. - Edward V Berard",
  ];

  const fetchRandomQuote = () => {
    try {
      const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
      setQuote(programmingQuotes[randomIndex]);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote("An error occurred while fetching a quote.");
    }
  };

  useEffect(() => {
    fetchRandomQuote();
    setCurrentYear(new Date().getFullYear());
  }, []);

  
  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setBillAmount(value);
    }
  };

  const handleTipPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setTipPercentage(value);
    } else if (e.target.value === '') {
      setTipPercentage(0);
    }
  };
  
  const handleNumberOfPeopleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
     if (!isNaN(value) && value >= 1) {
      setNumberOfPeople(value);
    } else if (e.target.value === '') {
      setNumberOfPeople(1);
    }
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode) || currencies[0];
    setSelectedCurrency(newCurrency);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background font-body">
      <Card className="w-full max-w-md shadow-2xl rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-headline text-primary">TipSplit</CardTitle>
          <CardDescription className="text-muted-foreground">
            Smartly calculate and split tips with friends.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
                <Label htmlFor="billAmount" className="text-base">Bill Amount</Label>
                <div className="w-1/3">
                    <Select value={selectedCurrency.code} onValueChange={handleCurrencyChange}>
                        <SelectTrigger className="h-9 text-sm border focus-visible:ring-accent">
                            <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map(currency => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.code} ({currency.symbol})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center space-x-3 bg-input/30 p-3 rounded-md border">
              <span className="text-muted-foreground text-lg w-6 text-center">{selectedCurrency.symbol}</span>
              <Input
                id="billAmount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={billAmount}
                onChange={handleBillAmountChange}
                className="text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipPercentageInput" className="text-base">Tip Percentage</Label>
            <div className="flex items-center space-x-3 bg-input/30 p-3 rounded-md border">
              <Percent className="text-muted-foreground h-5 w-5" />
              <Input
                id="tipPercentageInput"
                type="number"
                inputMode="numeric"
                value={tipPercentage}
                onChange={handleTipPercentageChange}
                min="0"
                max="100"
                className="w-20 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
              <Slider
                value={[tipPercentage]}
                onValueChange={([val]) => setTipPercentage(val)}
                max={50}
                step={1}
                className="flex-grow"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfPeopleInput" className="text-base">Number of People</Label>
            <div className="flex items-center space-x-3 bg-input/30 p-3 rounded-md border">
              <Users className="text-muted-foreground h-5 w-5" />
              <Button variant="outline" size="icon" onClick={() => setNumberOfPeople(p => Math.max(1, p - 1))} className="rounded-full bg-transparent hover:bg-primary/10">
                <Minus className="h-5 w-5" />
              </Button>
              <Input
                id="numberOfPeopleInput"
                type="number"
                inputMode="numeric"
                value={numberOfPeople}
                onChange={handleNumberOfPeopleChange}
                min="1"
                className="w-20 text-center text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
              <Button variant="outline" size="icon" onClick={() => setNumberOfPeople(p => p + 1)} className="rounded-full bg-transparent hover:bg-primary/10">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-md">
              <span className="text-lg text-foreground">Tip per Person:</span>
              <span className="text-2xl font-semibold text-primary">{selectedCurrency.symbol}{tipPerPerson.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-md">
              <span className="text-lg text-foreground">Total per Person:</span>
              <span className="text-2xl font-semibold text-primary">{selectedCurrency.symbol}{totalPerPerson.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <h3 className="text-xl font-headline text-primary flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-accent" />
              Programming Wisdom
            </h3>
            <p className="text-lg text-center italic text-muted-foreground">"{quote}"</p>
          </div>
        </CardContent>
        <CardFooter className="text-center text-xs text-muted-foreground pt-6">
            <p>&copy; {currentYear ? currentYear : '...'} TipSplit.</p>
        </CardFooter>
      </Card>
    </main>
  );
}
