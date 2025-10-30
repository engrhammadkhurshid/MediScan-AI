'use client'

import { useState, useRef, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { scanPrescription } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollText, Loader2, RefreshCw, Upload, Camera } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { ApiKeyErrorDialog } from '@/components/api-key-error-dialog'

const initialState = {
  transcription: undefined,
  summary: undefined,
  error: undefined,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScrollText className="mr-2 h-4 w-4" />}
      Scan Prescription
    </Button>
  )
}

export function PrescriptionScanner() {
  const [state, formAction] = useFormState(scanPrescription, initialState)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [key, setKey] = useState(Date.now())
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }
  
  useEffect(() => {
    if (state.error) {
      if (state.isApiKeyError) {
        setShowApiKeyDialog(true)
      } else {
        toast({
          variant: "destructive",
          title: "Scan Failed",
          description: state.error,
        })
      }
    }
  }, [state, toast])

  const handleReset = () => {
    formRef.current?.reset();
    setImagePreview(null);
    setKey(Date.now()); // Resets the form state by changing the key
  }

  return (
    <>
      <ApiKeyErrorDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} />
      <Card key={key}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Prescription Scanner</CardTitle>
        <CardDescription>Upload or take a photo of a handwritten prescription to get it transcribed and summarized.</CardDescription>
      </CardHeader>
      <CardContent>
        {!(state.summary || state.transcription) || state.error ? (
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="prescription-image">Prescription Image</Label>
              <Input id="prescription-image" name="image" type="file" accept="image/*" required onChange={handleImageChange} className="hidden" ref={fileInputRef}/>
               <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={() => {
                    fileInputRef.current?.removeAttribute('capture');
                    fileInputRef.current?.click();
                  }}>
                      <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    fileInputRef.current?.setAttribute('capture', 'environment');
                    fileInputRef.current?.click();
                  }}>
                      <Camera className="mr-2 h-4 w-4" /> Capture
                  </Button>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                <Image src={imagePreview} alt="Prescription preview" fill style={{ objectFit: 'contain' }} />
              </div>
            )}
            <SubmitButton />
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="font-headline text-lg flex items-center gap-2">
                      AI Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap leading-relaxed">{state.summary}</p>
                </CardContent>
            </Card>
            <Card className="bg-background/50">
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Full Transcription</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{state.transcription}</p>
                </CardContent>
            </Card>
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Another Prescription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )
}
