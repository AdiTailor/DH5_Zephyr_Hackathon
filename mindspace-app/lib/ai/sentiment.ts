export interface AnalysisResult {
  overallSummary: string;
  recentStatus: string;
  chartData: {
    date: string;
    sentiment: number;
    mood: number;
  }[];
}

export async function analyzeSentiment(entries: any[]): Promise<AnalysisResult> {
  try {
    const recentEntries = entries.slice(-10);
    const chartData = entries.map(entry => ({
      date: new Date(entry.created_at).toLocaleDateString(),
      sentiment: analyzeSentimentScore(entry.content),
      mood: entry.mood
    }));

    const overallPrompt = createOverallSummaryPrompt(entries);
    const recentPrompt = createRecentStatusPrompt(recentEntries);

    const [overallSummary, recentStatus] = await Promise.all([
      callGeminiAI(overallPrompt),
      callGeminiAI(recentPrompt)
    ]);

    return {
      overallSummary,
      recentStatus,
      chartData
    };
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return getFallbackAnalysis(entries);
  }
}

async function callGeminiAI(prompt: string): Promise<string> {
  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.7,
      },
    });

    const response = await result.response;
    return response.text() || 'Analysis in progress...';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}

function analyzeSentimentScore(content: string): number {
  const positiveWords = [
    'happy', 'joy', 'great', 'amazing', 'wonderful', 'excited', 'love', 'blessed', 
    'grateful', 'fantastic', 'awesome', 'brilliant', 'excellent', 'perfect', 
    'beautiful', 'successful', 'proud', 'confident', 'peaceful', 'content',
    'optimistic', 'hopeful', 'thrilled', 'delighted', 'cheerful', 'satisfied'
  ];
  
  const negativeWords = [
    'sad', 'angry', 'frustrated', 'disappointed', 'worried', 'anxious', 
    'depressed', 'awful', 'terrible', 'horrible', 'hate', 'stressed',
    'overwhelmed', 'lonely', 'afraid', 'confused', 'upset', 'annoyed',
    'exhausted', 'devastated', 'heartbroken', 'discouraged', 'hopeless'
  ];

  const words = content.toLowerCase().split(/\s+/);
  let score = 0;
  let wordCount = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (positiveWords.includes(cleanWord)) {
      score += 2;
      wordCount++;
    } else if (negativeWords.includes(cleanWord)) {
      score -= 2;
      wordCount++;
    }
  });
  
  const normalizedScore = wordCount > 0 ? (score / wordCount) * 25 : 0;
  return Math.max(-100, Math.min(100, normalizedScore));
}

function createOverallSummaryPrompt(entries: any[]): string {
  const entriesText = entries.slice(-15).map(entry => 
    `Date: ${new Date(entry.created_at).toLocaleDateString()}, Mood: ${entry.mood}/5, Content: ${entry.content.substring(0, 150)}...`
  ).join('\n\n');

  return `You are a compassionate AI wellness coach. Analyze these journal entries and provide an encouraging 3-sentence summary of the person's overall emotional growth and journey. Focus on patterns, improvements, and resilience. Be warm and supportive.

Journal Entries:
${entriesText}

Provide a supportive growth summary:`;
}

function createRecentStatusPrompt(recentEntries: any[]): string {
  const entriesText = recentEntries.map(entry => 
    `Date: ${new Date(entry.created_at).toLocaleDateString()}, Mood: ${entry.mood}/5, Content: ${entry.content.substring(0, 150)}...`
  ).join('\n\n');

  return `You are a caring AI wellness assistant. Based on these recent journal entries, provide a warm 2-sentence summary of this person's current emotional state. Acknowledge both challenges and victories with empathy.

Recent Entries:
${entriesText}

Current emotional status:`;
}

function getFallbackAnalysis(entries: any[]): AnalysisResult {
  const totalEntries = entries.length;
  const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
  
  const chartData = entries.map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString(),
    sentiment: analyzeSentimentScore(entry.content),
    mood: entry.mood
  }));

  let overallSummary = `Through your ${totalEntries} journal entries, you've shown remarkable dedication to self-reflection and emotional growth. `;
  
  if (avgMood >= 4) {
    overallSummary += `Your journey radiates positivity and emotional strength! You're consistently maintaining high emotional wellbeing and building resilience through your thoughtful reflections.`;
  } else if (avgMood >= 3) {
    overallSummary += `Your emotional journey shows healthy balance and wisdom. You're navigating life's complexities with grace and developing strong emotional intelligence through regular self-reflection.`;
  } else {
    overallSummary += `Your courage in documenting both challenges and victories shows incredible strength. Every entry demonstrates your commitment to growth and healing.`;
  }

  const recentEntries = entries.slice(-10);
  const recentAvg = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
  
  let recentStatus = `In your recent entries, `;
  if (recentAvg >= 4) {
    recentStatus += `you've been in a wonderful emotional space, showing positivity and emotional strength. Your recent reflections demonstrate growth and self-awareness.`;
  } else if (recentAvg >= 3) {
    recentStatus += `you've maintained good emotional balance while processing life's experiences. Your consistent journaling shows wisdom in working through various feelings.`;
  } else {
    recentStatus += `you've been courageously working through some challenges, which demonstrates real emotional maturity. Your commitment to self-reflection during difficult times shows incredible resilience.`;
  }

  return {
    overallSummary,
    recentStatus,
    chartData
  };
}
