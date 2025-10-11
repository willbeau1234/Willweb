# Chat Response Caching System

## Overview
The chat interface now includes a smart caching system that serves instant responses for common questions without hitting the LLM API, saving time and API costs.

## How It Works

### 1. Cache Check First
When a user sends a message, the system:
1. **Checks the cache first** using `findCachedResponse()`
2. If a match is found → **instant response** (no API call)
3. If no match → falls back to LLM API

### 2. Matching Strategy
The cache uses two levels of matching:

#### Level 1: Exact Match
- Case-insensitive exact matching
- Example: "Should I hire Will?" matches exactly

#### Level 2: Keyword Match
- If exact match fails, uses keyword-based fuzzy matching
- Requires at least 2 keyword matches
- Example: "why should I hire you" matches keywords ["hire", "should", "why"]

### 3. Visual Indicators
- **Cached responses**: Show ⚡ (Zap icon) in yellow
- **LLM responses**: Show ✨ (Sparkles icon)
- Users can hover over the icon to see "Instant cached response"

## File Structure

```
/lib/cached-prompts.ts       # Cache data and matching logic
/components/chat-interface.tsx   # Chat UI with cache integration
/modal/prompts.txt           # Source Q&A pairs
```

## Cached Questions

Current cached responses include:
1. Should I hire Will?
2. What makes Will different from other CS graduates?
3. What's Will's biggest professional achievement?
4. Can Will handle both technical and business stakeholders?
5. What are Will's core technical skills?
6. Does Will have real work experience?
7. What kind of role is Will looking for?
8. What leadership experience does Will have?
9. When is Will available?
10. Can Will prove his work delivers results?

## Adding New Cached Questions

To add new cached responses, edit `/lib/cached-prompts.ts`:

```typescript
{
  questions: [
    "Main question?",
    "Variation 1?",
    "Variation 2?",
  ],
  answer: "Your response here...",
  keywords: ["keyword1", "keyword2", "keyword3"],
}
```

### Tips for Keywords
- Use 4-6 relevant keywords
- Include synonyms (e.g., "hire", "employ", "recruit")
- Use single words, not phrases
- Make them specific to the question

## Benefits

1. **Instant Responses**: No API latency for common questions
2. **Cost Savings**: Reduces LLM API calls
3. **Consistent Answers**: Ensures employer questions get exactly the right response
4. **Better UX**: Users see instant responses with visual feedback

## Testing

Try these questions to see instant cached responses:
- "Should I hire Will?"
- "What makes Will different?"
- "What are Will's core technical skills?"
- "When is Will available?"

## Performance

- Cache lookup: < 1ms
- LLM API call: 500-2000ms
- **Speed improvement: 500-2000x faster for cached queries**
