
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PrescriptionScanner } from "@/app/components/prescription-scanner"
import { MedicineIdentifier } from "@/app/components/medicine-identifier"
import { Chatbot } from "@/app/components/chatbot"
import { Logo } from "@/components/logo"
import { Github, Linkedin, Briefcase, Mail } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 dark:bg-muted/40">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-center border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
        <div className="flex items-center gap-2">
           <Logo />
           <h1 className="font-headline text-xl font-semibold tracking-tight text-foreground">
            MediScan AI
           </h1>
        </div>
        <div className="absolute right-4">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full border-b bg-background">
          <div className="container mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-12 text-center md:py-20 lg:py-24">
            <div className="flex flex-col items-center space-y-4">
              <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Your Intelligent Health Companion
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Scan prescriptions, identify medicines, and get answers instantly with the power of AI.
              </p>
            </div>
          </div>
        </section>

        <div id="features" className="scroll-mt-20">
          <div className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
            <Tabs defaultValue="scan" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="scan">Scan Prescription</TabsTrigger>
                <TabsTrigger value="identify">Identify Medicine</TabsTrigger>
                <TabsTrigger value="chat">Ask a Question</TabsTrigger>
              </TabsList>
              <TabsContent value="scan">
                <PrescriptionScanner />
              </TabsContent>
              <TabsContent value="identify">
                <MedicineIdentifier />
              </TabsContent>
              <TabsContent value="chat">
                <Chatbot />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t bg-background/80 py-8 text-center">
        <div className="container mx-auto">
          <div className="mb-4">
            <h3 className="font-headline text-lg font-semibold">Hammad Khurshid</h3>
            <p className="text-sm text-muted-foreground">AI/ML Engineer | MSSE @ NUST</p>
          </div>
          <div className="mb-6 flex justify-center gap-4">
            <Button asChild>
              <Link href="mailto:engr.hammadkhurshid@gmail.com">
                <Mail className="mr-2 h-4 w-4" /> Hire Me
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://github.com/engrhammadkhurshid" target="_blank" rel="noopener noreferrer">
                <Briefcase className="mr-2 h-4 w-4" /> View Work
              </Link>
            </Button>
          </div>
          <div className="mb-4 flex justify-center gap-6">
            <Link href="https://github.com/engrhammadkhurshid" target="_blank" rel="noopener noreferrer">
              <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
            <Link href="https://www.linkedin.com/in/hammadkhurshid" target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 MediScan AI - AI-powered health companion
          </p>
           <p className="mt-2 text-xs text-muted-foreground">
            Released under the Apache-2.0 License.
          </p>
        </div>
      </footer>
    </div>
  )
}
