/**
 * Formats product description content for proper display.
 * Handles various formats:
 * - Plain text with \n escape sequences
 * - HTML content
 * - Mixed content
 */

// Check if string contains HTML tags
function containsHtml(str: string): boolean {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
}

// Check if string has escaped newlines like literal \n
function hasEscapedNewlines(str: string): boolean {
  return str.includes("\\n");
}

// Strip HTML tags and clean up content
function stripHtmlTags(html: string): string {
  // Create a temporary element to parse HTML
  if (typeof document !== "undefined") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  // Fallback for SSR - basic regex strip
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// Convert plain text to HTML with proper line breaks
function textToHtml(text: string): string {
  // First, replace escaped \n with actual line breaks
  let result = text.replace(/\\n/g, "\n");
  
  // Convert bullet points to proper list items
  const lines = result.split("\n");
  let inList = false;
  const processedLines: string[] = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Check if line starts with bullet point markers
    if (trimmedLine.match(/^[•\-\*]\s+/)) {
      if (!inList) {
        processedLines.push("<ul class='list-disc list-inside space-y-1 my-2'>");
        inList = true;
      }
      const content = trimmedLine.replace(/^[•\-\*]\s+/, "");
      processedLines.push(`<li>${content}</li>`);
    } else {
      if (inList) {
        processedLines.push("</ul>");
        inList = false;
      }
      
      if (trimmedLine === "") {
        processedLines.push("<br/>");
      } else {
        processedLines.push(`<p class="mb-2">${trimmedLine}</p>`);
      }
    }
  }
  
  if (inList) {
    processedLines.push("</ul>");
  }
  
  return processedLines.join("");
}

// Clean HTML content - remove empty divs and fix formatting
function cleanHtml(html: string): string {
  // Replace dir="auto" divs with proper paragraphs
  let result = html
    .replace(/<div dir="auto">/g, "<p>")
    .replace(/<\/div>/g, "</p>")
    .replace(/<p>\s*<\/p>/g, "<br/>")
    .replace(/(<br\s*\/?>\s*){3,}/g, "<br/><br/>"); // Limit consecutive breaks
  
  // Handle escaped newlines within HTML
  result = result.replace(/\\n/g, "<br/>");
  
  return result;
}

/**
 * Main function to format content for display
 */
export function formatProductContent(content: string | undefined | null): string {
  if (!content) return "";
  
  let text = content.trim();
  
  // If content looks like raw HTML tags as text (not rendered)
  if (text.includes("<div dir=") || text.includes("</div>")) {
    return cleanHtml(text);
  }
  
  // If content has proper HTML tags, clean and return
  if (containsHtml(text)) {
    return cleanHtml(text);
  }
  
  // If content has escaped newlines, convert to HTML
  if (hasEscapedNewlines(text)) {
    return textToHtml(text);
  }
  
  // Plain text without formatting - just add paragraph wrapper
  return `<p>${text}</p>`;
}

/**
 * Get plain text excerpt from HTML or formatted content
 */
export function getPlainTextExcerpt(content: string | undefined | null, maxLength: number = 150): string {
  if (!content) return "";
  
  // Strip HTML and clean up
  let text = stripHtmlTags(content);
  
  // Replace escaped newlines
  text = text.replace(/\\n/g, " ");
  
  // Clean up extra whitespace
  text = text.replace(/\s+/g, " ").trim();
  
  // Truncate if needed
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + "...";
  }
  
  return text;
}

