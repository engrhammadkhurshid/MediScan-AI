'use client'

import { useState, useRef, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { identifyMedicine } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Pill, Loader2, RefreshCw, Upload, Camera } from 'lucide-react'
import Image from 'next/image'
import { useToast } from '@/hooks/use-toast'
import { ApiKeyErrorDialog } from '@/components/api-key-error-dialog'

const initialState = {
  analysis: undefined,
  error: undefined,
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pill className="mr-2 h-4 w-4" />}
      Identify Medicine
    </Button>
  )
}

export function MedicineIdentifier() {
  const [state, formAction] = useFormState(identifyMedicine, initialState)
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
          title: "Analysis Failed",
          description: state.error,
        })
      }
    }
  }, [state, toast])

  const handleReset = () => {
    formRef.current?.reset();
    setImagePreview(null);
    setKey(Date.now());
  }

  return (
    <>
      <ApiKeyErrorDialog open={showApiKeyDialog} onOpenChange={setShowApiKeyDialog} />
      <Card key={key}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Medicine Identifier</CardTitle>
        <CardDescription>Upload or take a photo of a medicine and ask a question about it.</CardDescription>
      </CardHeader>
      <CardContent>
        {!state.analysis || state.error ? (
          <form ref={formRef} action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="medicine-image">Medicine Image</Label>
              <Input id="medicine-image" name="image" type="file" accept="image/*" required onChange={handleImageChange} className="hidden" ref={fileInputRef} />
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

              {imagePreview && (
                <div className="mt-4 relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <Image src={imagePreview} alt="Medicine preview" fill style={{ objectFit: 'contain' }} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicine-query">Your Question</Label>
              <Textarea id="medicine-query" name="query" placeholder="e.g., What is this medicine used for? What are the side effects?" required />
            </div>
            <SubmitButton />
          </form>
        ) : (
          <div className="space-y-4">
            <Card className="bg-background/50">
              <CardHeader>
                <CardTitle className="font-headline text-lg">Analysis Result</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap leading-relaxed">{state.analysis}</p>
              </CardContent>
            </Card>
            <Button variant="outline" onClick={handleReset} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Analyze Another Medicine
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )
}
