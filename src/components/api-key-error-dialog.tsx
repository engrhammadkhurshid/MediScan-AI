'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Github, Linkedin, Mail } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ApiKeyErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApiKeyErrorDialog({ open, onOpenChange }: ApiKeyErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">🔑 API Key Required</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p className="text-base">
              This application requires a Google Gemini API key to function. 
              Please add your API key to the <code className="bg-muted px-2 py-1 rounded text-sm">.env</code> file.
            </p>
            
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">How to get your API key:</p>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</a></li>
                <li>Create or select your API key</li>
                <li>Add it to your <code className="bg-background px-1 py-0.5 rounded">.env</code> file as <code className="bg-background px-1 py-0.5 rounded">GOOGLE_GENAI_API_KEY=your_key_here</code></li>
                <li>Restart the application</li>
              </ol>
            </div>

            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-semibold mb-3 text-center">Need help? Contact the developer:</p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:engr.hammadkhurshid@gmail.com" className="text-primary hover:underline">
                    engr.hammadkhurshid@gmail.com
                  </a>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                  <Link href="https://github.com/engrhammadkhurshid" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/hammadkhurshid" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>I Understand</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
