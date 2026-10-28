/**
 * Strips HTML tags and normalizes whitespace from TipTap output
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface TextChunk {
  chunkIndex: number;
  text: string;
}

/**
 * Splits plain text into overlapping chunks
 * Target chunk size: ~1200 characters (~300 tokens)
 * Target overlap: ~200 characters (~50 tokens)
 */
export function chunkText(
  text: string,
  chunkSize: number = 1200,
  overlap: number = 200
): TextChunk[] {
  if (!text || text.length === 0) {
    return [];
  }

  if (text.length <= chunkSize) {
    return [{ chunkIndex: 0, text }];
  }

  const chunks: TextChunk[] = [];
  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    // Avoid breaking words mid-way
    if (endIndex < text.length) {
      const lastSpace = text.lastIndexOf(" ", endIndex);
      if (lastSpace > startIndex) {
        endIndex = lastSpace;
      }
    }

    const chunkContent = text.slice(startIndex, endIndex).trim();
    if (chunkContent.length > 0) {
      chunks.push({ chunkIndex, text: chunkContent });
      chunkIndex++;
    }

    startIndex = endIndex - overlap;
    if (startIndex >= text.length - overlap) break;
  }

  return chunks;
}
