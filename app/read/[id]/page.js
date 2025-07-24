"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { api } from "@/utils/auth/readerApi";
import { useAuth } from "@/contexts/AuthContext";

const PdfFlipbook = dynamic(() => import("@/components/PdfFlipbook"), {
  ssr: false,
});

export default function BookReaderPage() {
  const { isLoggedIn, userId: currentUserId, authToken } = useAuth();
  const params = useParams();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await api.get(`/books/${params.id}/content`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob", // 👈 Important for reading binary PDF data
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setTitle(`Book ${params.id}`);
      } catch (error) {
        console.error("Error fetching PDF:", error);
        if (error.response?.status === 401) {
          console.warn("Unauthorized — maybe redirect to login");
        }
      }
    };

    if (params.id && authToken) {
      fetchPdf();
    }
  }, [params.id, authToken]);

  if (!pdfUrl) return <p>Loading...</p>;

  return (
    <div>
      <h1>{title}</h1>
      <PdfFlipbook pdfUrl={pdfUrl} />
    </div>
  );
}
