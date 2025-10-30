# **App Name**: MediScan AI

## Core Features:

- Prescription OCR & Extraction: Use OCR technology to scan and extract text from doctor's handwritten prescriptions. Label prescribed medicines and prepare the contents for presentation in the application.
- Detailed Explanation Display: Show the user detailed explanations of the doctor's prescriptions using generated or summarized content based on recognized medical information, making sure the explanations from doctor are not lost.
- Medicinal Data Chatbot: A chatbot powered by Gemini API, which can respond to medicinal data queries and provide information from trusted sources. Integrate a free, publicly available Medicinal Data API that exposes formulas, usages, side effects, and documented details about medicines. The chatbot also analyzes the prompt to check for personal or unsafe content.
- Image-Based Medicine Info: Users can provide a photo of any medicine, and the Gemini API tool will process the photo and provide the user with the latest information about the medicine or its usage and any other details the user may ask.
- Secure Query Processing: Analyze and scan user input for security purposes. Process queries with care and deny any unrelated queries, only medicine information must be provided.

## Style Guidelines:

- Background color: Very light gray (#F8F9FA), reminiscent of Google's clean interface, creating a neutral backdrop.
- Primary color: Google blue (#4285F4), offering a sense of trust and authority.
- Accent color: Google red (#DB4437), providing contrast and drawing attention to key actions and information.
- Body text: 'PT Sans', a humanist sans-serif for readability and warmth.
- Headline text: 'Space Grotesk', a strong sans-serif for headings and titles.
- Use Material UI components for a consistent and accessible user interface.
- Incorporate medical icons that match the selected colour pallete for a visual connection to each function.
- Subtle animations on loading and transitions.