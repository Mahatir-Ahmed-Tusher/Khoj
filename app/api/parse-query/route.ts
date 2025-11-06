import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

/**
 * API endpoint to parse extracted text into optimized fact-checkable claim
 * Uses GPT-OSS-120B to intelligently extract the main claim from extracted text
 */
export async function POST(request: NextRequest) {
  try {
    const { text, source, userMessage } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Valid text is required' },
        { status: 400 }
      );
    }

    console.log('📝 Parsing query from extracted text (source:', source || 'unknown', ')');
    
    // Validate and sanitize user message if provided
    let sanitizedUserMessage: string | undefined = undefined;
    if (userMessage && typeof userMessage === 'string') {
      const trimmed = userMessage.trim();
      if (trimmed.length > 0 && trimmed.length <= 500) {
        sanitizedUserMessage = trimmed;
        console.log('📝 User message provided:', sanitizedUserMessage);
      } else if (trimmed.length > 500) {
        console.warn('⚠️ User message too long, truncating to 500 characters');
        sanitizedUserMessage = trimmed.substring(0, 500);
      } else {
        console.log('📝 User message is empty, ignoring');
      }
    }

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      console.warn('⚠️ GROQ_API_KEY not configured, returning original text');
      return NextResponse.json({
        claim: text,
        source: 'fallback',
        originalText: text
      });
    }

    const groqClient = new Groq({ apiKey: groqApiKey });

    // Create a prompt to extract the main fact-checkable claim from extracted text
    // Include user message if provided
    const queryParsingPrompt = `You are an intelligent fact-checking assistant. Your task is to analyze the provided text extracted from an image (photocard/news image)${sanitizedUserMessage ? ' along with the user\'s question or message' : ''} and create an optimized fact-checkable claim or statement that should be verified.

${sanitizedUserMessage ? `**IMPORTANT:** The user has written a question or message about the photocard. You MUST incorporate both the extracted text AND the user's message when creating the fact-checkable claim. The user's message is a specific question or context that should guide what needs to be fact-checked.

**Format:**
- Extracted Text from Image: [text from image]
- User's Question/Message: [user's message]

**Your Task:** Create a single, optimized fact-checkable claim that combines relevant information from BOTH the extracted text and the user's message.` : `**Extracted Text from Image:**`}

${sanitizedUserMessage ? `**Extracted Text from Image:**
${text.substring(0, 2000)}

**User's Question/Message:**
${sanitizedUserMessage}

**Important Notes:**
- The user's message is a specific question or context about the photocard
- You MUST consider both pieces of information when creating the claim
- If the user asks a question, incorporate it into the claim format
- If the user provides context or additional information, use it to refine/extract the most relevant claim from the extracted text
- The claim should address what the user wants to verify, not just what's in the image
- If the user asks "কবে?", "কোথায়?", "কত?", "কিভাবে?", "কেন?", etc., make sure the claim addresses that specific question
- If the user provides additional context or information, combine it intelligently with the extracted text` : `**Extracted Text from Image:**
${text.substring(0, 2000)}`}

**Instructions:**
1. ${sanitizedUserMessage ? 'Read BOTH the extracted text AND the user\'s message carefully. Understand what the user wants to verify based on their question or message.' : 'Read the extracted text carefully'} and identify the main claim, statement, or assertion that needs to be fact-checked.
2. Create an optimized fact-checkable claim. This should be:
   - A specific, verifiable statement${sanitizedUserMessage ? ' that addresses the user\'s question/message' : ''}
   - ${sanitizedUserMessage ? 'The claim should intelligently combine information from both the extracted text and user\'s message' : 'The main claim or assertion made in the text'}
   - Clear and concise (ideally 10-50 words, maximum 200 words)
   - Focused on what can be fact-checked (specific events, statements, claims, not opinions)
   - Well-formatted with proper grammar and spelling corrections if needed
   - ${sanitizedUserMessage ? 'If the user asked a question, the claim should be formatted to answer that question naturally' : 'If extracted text has OCR errors, correct them intelligently'}
3. If the text contains multiple claims, extract the PRIMARY or MOST IMPORTANT claim${sanitizedUserMessage ? ' that relates to or answers the user\'s question/message' : ''}.
4. ${sanitizedUserMessage ? 'If the user\'s message asks about something specific (e.g., "কবে?", "কোথায়?", "কত?", "কিভাবে?", "কেন?", "কি?", "কোন?", "কাদের?"), make sure the claim addresses that specific aspect. For example, if user asks "কবে?", the claim should focus on the timing/date aspect.' : 'If the text is unclear or contains errors from OCR, intelligently correct and clarify it'}.
5. Write the claim in the same language as the text (Bengali or English).
6. The output MUST be ONLY the claim text, no explanations, no JSON format, just the claim itself.

**Examples:**
${sanitizedUserMessage ? `- Extracted text: "প্রধানমন্ত্রী শেখ হাসিনা নতুন প্রকল্প ঘোষণা করেছেন"
  User message: "এই প্রকল্প কবে শুরু হবে?"
  Claim: "প্রধানমন্ত্রী শেখ হাসিনা ঘোষিত নতুন প্রকল্প কবে শুরু হবে?"

- Extracted text: "২০২৩ সালের বন্যায় সিলেট সম্পূর্ণভাবে ডুবে গিয়েছিল"
  User message: "এই খবরটি সত্য কিনা?"
  Claim: "২০২৩ সালের বন্যায় সিলেট সম্পূর্ণভাবে ডুবে গিয়েছিল কিনা"

- Extracted text: "বাংলাদেশের অর্থনীতি ভালো চলছে"
  User message: "কোন উৎস থেকে এই তথ্য?"
  Claim: "বাংলাদেশের অর্থনীতি ভালো চলছে - এই তথ্যের উৎস কী?"

- Extracted text: "শেখ হাসিনা ঢাকায় একটি সমাবেশে বক্তব্য দিয়েছেন"
  User message: "এই সমাবেশ কোথায় হয়েছিল?"
  Claim: "শেখ হাসিনার বক্তব্যের সমাবেশ কোথায় হয়েছিল?"` : `- If extracted text is "প্রধানমন্ত্রী শেখ হাসিনা নতুন প্রকল্প ঘোষণা করেছেন", the claim is: "প্রধানমন্ত্রী শেখ হাসিনা নতুন প্রকল্প ঘোষণা করেছেন"
- If extracted text is about a specific event, extract the main event claim: "২০২৩ সালের বন্যায় সিলেট সম্পূর্ণভাবে ডুবে গিয়েছিল"`}

**Output ONLY the claim text (no explanations, no JSON, no markdown):**`;

    const completion = await groqClient.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: queryParsingPrompt
        }
      ],
      temperature: 0.3, // Lower temperature for more focused extraction
      max_tokens: 500,
      top_p: 1
    });

    const parsedText = completion.choices[0]?.message?.content || '';
    console.log('📝 GPT-OSS-120B parsed query:', parsedText);
    
    // Clean the response - remove markdown, JSON markers, explanations
    let cleanedClaim = parsedText.trim();
    
    // Remove markdown code blocks if present
    cleanedClaim = cleanedClaim.replace(/```json\s*|\```/g, '').replace(/```\s*|\```/g, '');
    
    // Remove JSON wrapper if present
    cleanedClaim = cleanedClaim.replace(/^{[\s\S]*?"claim"[\s\S]*?:\s*"([^"]+)"[\s\S]*?}$/i, '$1');
    cleanedClaim = cleanedClaim.replace(/^{[\s\S]*?"query"[\s\S]*?:\s*"([^"]+)"[\s\S]*?}$/i, '$1');
    cleanedClaim = cleanedClaim.replace(/^{[\s\S]*?"text"[\s\S]*?:\s*"([^"]+)"[\s\S]*?}$/i, '$1');
    
    // Remove quotes if wrapped
    cleanedClaim = cleanedClaim.replace(/^["']|["']$/g, '');
    
    // Remove explanations (lines after empty line or after "Claim:" etc.)
    const lines = cleanedClaim.split('\n');
    const claimLines: string[] = [];
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Stop if we hit explanation markers
      if (trimmedLine === '' || 
          trimmedLine.toLowerCase().startsWith('note:') ||
          trimmedLine.toLowerCase().startsWith('explanation:') ||
          trimmedLine.toLowerCase().startsWith('reasoning:') ||
          trimmedLine.toLowerCase().startsWith('context:')) {
        break;
      }
      // Skip JSON structure lines
      if (!trimmedLine.startsWith('{') && !trimmedLine.startsWith('}') && 
          !trimmedLine.includes('"type"') && !trimmedLine.includes('"confidence"')) {
        claimLines.push(trimmedLine);
      }
    }
    
    cleanedClaim = claimLines.join(' ').trim();
    
    // Validate the parsed claim
    if (cleanedClaim && cleanedClaim.length > 10 && cleanedClaim.length < 500) {
      console.log('✅ Successfully parsed optimized claim using GPT-OSS-120B');
      return NextResponse.json({
        claim: cleanedClaim,
        source: 'gpt-oss-120b',
        originalText: text
      });
    } else {
      console.warn('⚠️ Parsed claim validation failed, returning original text');
      // Fallback to original text or first meaningful sentence
      const firstSentence = text.split(/[.!?।]/)[0];
      const fallbackClaim = firstSentence.length > 20 
        ? firstSentence.substring(0, 200) 
        : text.substring(0, 200);
      
      return NextResponse.json({
        claim: fallbackClaim,
        source: 'fallback',
        originalText: text
      });
    }
  } catch (error) {
    console.error('❌ Query parsing error:', error);
    // Fallback to original text
    const { text } = await request.json();
    const firstSentence = text?.split(/[.!?।]/)[0] || '';
    const fallbackClaim = firstSentence.length > 20 
      ? firstSentence.substring(0, 200) 
      : (text?.substring(0, 200) || '');
    
    return NextResponse.json({
      claim: fallbackClaim,
      source: 'error-fallback',
      originalText: text || ''
    });
  }
}

