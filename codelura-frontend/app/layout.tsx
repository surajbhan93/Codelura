import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Providers } from "./providers";
export const metadata = {
  title: "Codelura",
  description: "Revenue-focused SaaS & service platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
         <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>

         
         <CursorGlow />
        <Navbar />
        <Providers>
            {children}
        </Providers>
      
         <Toaster position="top-right" reverseOrder={false} />
        <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
