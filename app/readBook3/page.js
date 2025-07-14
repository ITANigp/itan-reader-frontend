// pages/index.js (or app/page.jsx for App Router)
import PdfFlipbook from "@/components/PdfFlipbook";

export default function HomePage() {
  const pdfExampleUrl = "/CYBERSECURITY.pdf"; // Place your PDF in the public folder

  return (
    <div>
      <h1>My Interactive PDF Flipbook</h1>
      <PdfFlipbook pdfUrl={pdfExampleUrl} />
    </div>
  );
}
