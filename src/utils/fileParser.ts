import { CandidateResume } from '../types';

/**
 * Extracts plain text from an uploaded file (TXT, PDF, DOCX, JSON).
 */
export async function extractTextFromFile(file: File): Promise<CandidateResume> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  let extractedText = '';

  try {
    if (extension === 'txt' || extension === 'json') {
      extractedText = await file.text();
    } else if (extension === 'pdf') {
      // Extract text content from PDF binary stream
      extractedText = await parsePdfSimple(file);
    } else if (extension === 'docx') {
      extractedText = await parseDocxSimple(file);
    } else {
      // Fallback read as text
      extractedText = await file.text();
    }
  } catch (err) {
    console.warn(`Could not deeply extract text from ${file.name}, using fallback:`, err);
    extractedText = `Resume: ${file.name}\n(Automatic text extraction encountered non-standard formatting, candidate file uploaded for review)`;
  }

  // Clean up binary noise if any
  const cleanedText = extractedText.replace(/[^\x20-\x7E\u0600-\u06FF\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    id: `cv-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    fileName: file.name,
    fileSize: file.size,
    rawText: cleanedText.length > 50 ? cleanedText : `Resume File: ${file.name}\n${file.name.replace(/[_.-]/g, ' ')}`,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Simple client-side text extractor for PDF by reading text stream objects
 */
async function parsePdfSimple(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const textDecoder = new TextDecoder('utf-8');
  const rawString = textDecoder.decode(buffer);

  // Match text within BT ... ET blocks and parenthesis strings (text) in PDF syntax
  const textMatches = rawString.match(/\(([^()]{2,})\)/g);
  if (textMatches && textMatches.length > 10) {
    const textPieces = textMatches
      .map((m) => m.slice(1, -1).replace(/\\([()\\])/g, '$1'))
      .filter((s) => s.length > 1 && !/^[\d\s.,]+$/.test(s));
    
    if (textPieces.length > 15) {
      return textPieces.join(' ');
    }
  }

  // Fallback: extract printable ASCII words of 3+ chars
  const words = rawString.match(/[A-Za-z0-9@.+#/-]{3,}/g) || [];
  return words.slice(0, 1000).join(' ');
}

/**
 * Simple client-side text extractor for DOCX by parsing XML strings
 */
async function parseDocxSimple(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const textDecoder = new TextDecoder('utf-8');
  const rawString = textDecoder.decode(buffer);

  // Match <w:t>...</w:t> tags in Word OpenXML
  const tagMatches = rawString.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (tagMatches && tagMatches.length > 0) {
    const textPieces = tagMatches.map((m) => m.replace(/<[^>]+>/g, ''));
    return textPieces.join(' ');
  }

  // Fallback: extract words
  const words = rawString.match(/[A-Za-z0-9@.+#/-]{3,}/g) || [];
  return words.slice(0, 1000).join(' ');
}

/**
 * Parses batch text where candidates are separated by delimiters
 */
export function parsePastedBatch(pastedText: string): CandidateResume[] {
  if (!pastedText.trim()) return [];

  const candidateBlocks = pastedText
    .split(/(?:---|===|Candidate\s*#?\d+:|امیدوار\s*#?\d+:)/gi)
    .map((b) => b.trim())
    .filter((b) => b.length > 30);

  if (candidateBlocks.length === 0 && pastedText.trim().length > 30) {
    candidateBlocks.push(pastedText.trim());
  }

  return candidateBlocks.map((block, idx) => {
    // Attempt to guess candidate name from first line
    const firstLine = block.split('\n')[0].replace(/^(Resume|CV|Candidate|Name|امیدوار):?/i, '').trim();
    const candidateName = firstLine.slice(0, 30) || `Candidate ${idx + 1}`;

    return {
      id: `pasted-${Date.now()}-${idx}`,
      fileName: `${candidateName.replace(/\s+/g, '_')}_Resume.txt`,
      fileSize: block.length,
      rawText: block,
      uploadedAt: new Date().toISOString(),
    };
  });
}
