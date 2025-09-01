// Markdown parsing utilities
export function parseMarkdown(text: string): string {
  if (!text) return ''
  
  let result = text
    
  // Bold text: **text** -> <strong>text</strong>
  result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic text: *text* -> <em>text</em> (but not if it's part of bold)
  result = result.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
  
  // Headers: # Header -> <h1>Header</h1>
  result = result.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
  result = result.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h2>')
  result = result.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">$1</h1>')
  
  // Links: [text](url) -> <a href="url">text</a>
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>')
  
  // Images: ![alt](url) -> <img src="url" alt="alt" class="...">
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-6 rounded-lg shadow-md" />')
  
  // Lists: - item -> <li>item</li>
  result = result.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
  
  // Numbered lists: 1. item -> <li>item</li>
  result = result.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
  
  // Wrap consecutive list items in ul/ol tags
  result = result.replace(/(<li.*?<\/li>(\s*<li.*?<\/li>)*)/gs, '<ul class="list-disc ml-6 mb-4">$1</ul>')
  
  // Line breaks and paragraphs
  result = result.replace(/\n\n/g, '</p><p class="mb-4">')
  result = result.replace(/\n/g, '<br>')
  
  // Wrap remaining text in paragraph tags
  result = result.replace(/^([^<].*)$/gm, '<p class="mb-4">$1</p>')
  
  // Clean up empty paragraphs and fix structure
  result = result.replace(/<p class="mb-4"><\/p>/g, '')
  result = result.replace(/<p class="mb-4"><br><\/p>/g, '')
  result = result.replace(/<p class="mb-4"><\/p>/g, '')
  
  // Fix double line breaks
  result = result.replace(/<br><br>/g, '</p><p class="mb-4">')
  
  return result
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - allow img and anchor tags but sanitize them
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
    .replace(/<img([^>]*)>/gi, (match, attributes) => {
      // Only allow safe img attributes
      const safeAttributes = attributes.match(/(src|alt|class)=["'][^"']*["']/gi) || []
      return `<img${safeAttributes.join(' ')} />`
    })
    .replace(/<a([^>]*)>/gi, (match, attributes) => {
      // Only allow safe anchor attributes
      const safeAttributes = attributes.match(/(href|target|rel|class)=["'][^"']*["']/gi) || []
      return `<a${safeAttributes.join(' ')}>`
    })
}
