# MediScan AI

Your intelligent health companion powered by Google Gemini AI. Scan prescriptions, identify medicines, and get instant answers about medications.

## 🚀 Features

- **📋 Prescription Scanner**: Upload or capture handwritten prescriptions to get them transcribed and summarized
- **💊 Medicine Identifier**: Take a photo of any medicine and ask questions about it
- **💬 AI Medical Assistant**: Chat with an AI to get information about medicines, dosages, and side effects

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3 (App Router)
- **AI**: Google Gemini (via GenKit)
- **UI**: Radix UI + Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API Key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "MediScan AI"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   GOOGLE_GENAI_API_KEY=your_api_key_here
   ```
   
   **How to get your API key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key or use an existing one
   - Copy the API key and paste it in your `.env` file

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run genkit:dev` - Start GenKit development server
- `npm run genkit:watch` - Start GenKit in watch mode

## 🔒 Security & Privacy

This application processes sensitive medical information. Please ensure:
- Your API key is kept secure and never committed to version control
- The `.env` file is listed in `.gitignore`
- Users are informed about data being sent to Google's Gemini API

## 🚨 Important Notes

- **API Key Required**: The application will show an error dialog if the API key is missing or invalid
- **Medical Disclaimer**: This is a practice project and should not be used as a substitute for professional medical advice
- **Data Privacy**: Images and queries are sent to Google's Gemini API for processing

## 👨‍💻 Developer

**Hammad Khurshid**  
AI/ML Engineer | MSSE @ NUST

- 📧 Email: [engr.hammadkhurshid@gmail.com](mailto:engr.hammadkhurshid@gmail.com)
- 💼 GitHub: [@engrhammadkhurshid](https://github.com/engrhammadkhurshid)
- 🔗 LinkedIn: [Hammad Khurshid](https://www.linkedin.com/in/hammadkhurshid)

## 📄 License

Released under the Apache-2.0 License.

---

**Note**: This is a practice project using the Gemini API. It is not intended for production medical use.