'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { askQuestion } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ApiKeyErrorDialog } from '@/components/api-key-error-dialog'

interface Message {
  role: 'user' | 'bot'
  content: string
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const { toast } = useToast()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await askQuestion(input)
      if (result.error) {
        if (result.isApiKeyError) {
          setShowApiKeyDialog(true)
          setMessages((prev) => prev.slice(0, -1))
        } else {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: result.error,
          })
          setMessages((prev) => prev.slice(0, -1))
        }
      } else if (result.answer) {
        const botMessage: Message = { role: 'bot', content: result.answer }
        setMessages((prev) => [...prev, botMessage])
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred',
        description: error.message || 'Please try again later.',
      })
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <ApiKeyErrorDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} />
      <Card className="h-[70vh] flex flex-col bg-background/50 border shadow-lg rounded-xl">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary">
              <Bot className="h-6 w-6"/>
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-xl">AI Medical Assistant</CardTitle>
            <CardDescription>Your personal guide to medicine information.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col h-full min-h-[40vh] items-center justify-center text-center text-muted-foreground p-4">
                <Sparkles className="h-10 w-10 mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-1">Start a Conversation</h3>
                <p className="max-w-xs">Ask me anything about medicines, dosages, side effects, and more.</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-4 animate-in fade-in',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'bot' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback className="bg-primary/10"><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-2xl p-4 text-base shadow-md',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-4 justify-start animate-in fade-in">
                <Avatar className="h-8 w-8 border">
                   <AvatarFallback className="bg-primary/10"><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-2xl p-4 shadow-md rounded-bl-none">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
                <div className="border-t p-4 bg-background/80">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., What is paracetamol for?"
              disabled={isLoading}
              className="flex-1 text-base h-12 rounded-full px-5 focus-visible:ring-primary/50"
              autoFocus
            />
            <Button type="submit" size="icon" className="rounded-full h-12 w-12" disabled={isLoading || !input.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Send Message</span>
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
