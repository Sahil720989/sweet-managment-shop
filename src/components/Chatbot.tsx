import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useSweets } from '@/hooks/useSweets';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Sweet Shop Assistant. I can help you choose sweets, answer questions about our products, and assist with purchases. What would you like to know?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sweets } = useSweets();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(userMessage.toLowerCase());
      addMessage(response, 'bot');
      setIsTyping(false);
    }, 1000);
  };

  const generateResponse = (message: string): string => {
    // Basic keyword matching for responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! Welcome to Sweet Shop. How can I help you today?';
    }

    if (message.includes('diwali') || message.includes('festival')) {
      return 'For Diwali, I recommend our Chocolate Cake, Motichoor Ladoo, or premium cupcakes. These are perfect for celebrations. Would you like to know prices or place an order?';
    }

    if (message.includes('wedding') || message.includes('marriage')) {
      return 'For weddings, our Chocolate Cake and assorted cupcakes make beautiful centerpieces. We also have special gift packaging. What would you like to order?';
    }

    if (message.includes('birthday')) {
      return 'For birthdays, our Chocolate Cake, colorful cupcakes, or Strawberry Ice Cream are perfect! We can customize messages too. What type of dessert are you looking for?';
    }

    if (message.includes('sugar free') || message.includes('diabetic')) {
      return 'We have sugar-free options like sugar-free jalebis and diabetic-friendly sweets. Please check with our staff for specific recommendations based on your needs.';
    }

    if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
      const availableSweets = sweets.slice(0, 5); // Show first 5 sweets
      let response = 'Here are some of our popular sweets with prices:\n';
      availableSweets.forEach(sweet => {
        response += `• ${sweet.name}: $${sweet.price.toFixed(2)} (${sweet.quantity} in stock)\n`;
      });
      response += '\nWould you like to order any of these?';
      return response;
    }

    if (message.includes('buy') || message.includes('order') || message.includes('purchase')) {
      return 'I\'d be happy to help you place an order! What sweet would you like to buy and how much quantity?';
    }

    if (message.includes('available') || message.includes('stock') || message.includes('in stock')) {
      const inStock = sweets.filter(s => s.quantity > 0);
      return `We currently have ${inStock.length} different sweets in stock. Popular ones include ${inStock.slice(0, 3).map(s => s.name).join(', ')}. What are you looking for?`;
    }

    if (message.includes('recommend') || message.includes('suggest')) {
      return 'Based on popularity, I recommend Chocolate Cake, Vanilla Cupcake, and Strawberry Ice Cream. What occasion is this for, or do you have a preferred taste?';
    }

    if (message.includes('cake')) {
      const cakes = sweets.filter(s => s.category.toLowerCase().includes('cake'));
      if (cakes.length > 0) {
        return `We have delicious cakes! ${cakes.map(c => `${c.name} for $${c.price.toFixed(2)}`).join(', ')}. Which one would you like?`;
      }
    }

    if (message.includes('cupcake')) {
      const cupcakes = sweets.filter(s => s.category.toLowerCase().includes('cupcake'));
      if (cupcakes.length > 0) {
        return `Our cupcakes are amazing! ${cupcakes.map(c => `${c.name} for $${c.price.toFixed(2)}`).join(', ')}. Perfect for any occasion!`;
      }
    }

    if (message.includes('ice cream') || message.includes('icecream')) {
      const iceCreams = sweets.filter(s => s.category.toLowerCase().includes('ice cream'));
      if (iceCreams.length > 0) {
        return `We have refreshing ice creams! ${iceCreams.map(i => `${i.name} for $${i.price.toFixed(2)}`).join(', ')}. What flavor interests you?`;
      }
    }

    if (message.includes('chocolate')) {
      const chocolates = sweets.filter(s => s.name.toLowerCase().includes('chocolate') || s.category.toLowerCase().includes('chocolate'));
      if (chocolates.length > 0) {
        return `Our chocolate items are heavenly! ${chocolates.map(c => `${c.name} for $${c.price.toFixed(2)}`).join(', ')}. Which one tempts you?`;
      }
    }

    if (message.includes('milk') || message.includes('dairy')) {
      return 'Our milk-based sweets include various ice creams and creamy desserts. We also have dairy-free options available.';
    }

    if (message.includes('dry') || message.includes('crunchy')) {
      return 'For dry/crunchy sweets, try our cookies, popcorn, or traditional snacks.';
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return 'You\'re welcome! Feel free to ask if you need anything else. Happy shopping! 🍬';
    }

    // Check for specific sweet names
    const foundSweet = sweets.find(s =>
      message.includes(s.name.toLowerCase()) ||
      message.includes(s.category.toLowerCase())
    );

    if (foundSweet) {
      return `${foundSweet.name} is $${foundSweet.price.toFixed(2)} and we have ${foundSweet.quantity} in stock. ${foundSweet.description || ''} Would you like to order some?`;
    }

    // Default response
    return 'I\'m here to help with information about our sweets, recommendations, and placing orders. What would you like to know about our sweet shop?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-accent hover:bg-accent/90"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl border-2 border-accent/20">
          <CardHeader className="pb-3 bg-accent/10">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                Sweet Shop Assistant
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-80">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        message.sender === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-secondary text-secondary-foreground rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about sweets..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}