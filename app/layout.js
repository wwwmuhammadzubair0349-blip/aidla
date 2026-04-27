import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata = {
  title: "AIDLA",
  description: "Pakistan's #1 education platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <main style={{ minHeight: "100vh" }}>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}