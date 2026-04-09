"use server";

import { redirect } from "next/navigation";
import { generateQuizOrFlashcard } from "@/lib/ai";
import mammoth from "mammoth";
import PDFParser from "pdf2json";

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: unknown) => {
      const msg =
        err &&
        typeof err === "object" &&
        "parserError" in err &&
        err.parserError instanceof Error
          ? err.parserError.message
          : "Failed to parse PDF";
      reject(new Error(msg));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R.map((r) => r.T).join(""))).join(" ")
      ).join("\n");
      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function generateContent(formData: FormData) {
  const mode = (formData.get("mode") as "quiz" | "flashcard") ?? "quiz";
  const count = parseInt((formData.get("count") as string) ?? "10", 10);
  const pastedText = (formData.get("notes") as string) ?? "";
  const file = formData.get("file") as File | null;

  let notes = pastedText.trim();

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".pdf")) {
      notes = await extractTextFromPDF(buffer);
    } else if (fileName.endsWith(".docx")) {
      notes = await extractTextFromDOCX(buffer);
    } else if (fileName.endsWith(".txt")) {
      notes = buffer.toString("utf-8");
    }
  }

  if (!notes || notes.trim().length < 20) {
    throw new Error("Please provide some notes (at least 20 characters) to generate content.");
  }

  let result;
  try {
    result = await generateQuizOrFlashcard(notes, mode, count);
  } catch (err: unknown) {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw.includes("401") || raw.toLowerCase().includes("invalid api key") || raw.toLowerCase().includes("invalid_api_key")) {
      throw new Error("Invalid Groq API key. Please set a valid GROQ_API_KEY in your .env.local file.");
    }
    if (raw.includes("429")) {
      throw new Error("Groq rate limit reached. Please wait a moment and try again.");
    }
    throw new Error("AI generation failed: " + raw);
  }

  const encoded = encodeURIComponent(JSON.stringify(result.data));

  if (mode === "quiz") {
    redirect(`/quiz?data=${encoded}`);
  } else {
    redirect(`/flashcard?data=${encoded}`);
  }
}
