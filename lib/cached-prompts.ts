// Cached Q&A pairs for instant responses without LLM calls
export interface CachedPrompt {
  questions: string[] // Multiple variations of the same question
  answer: string
  keywords: string[] // For fuzzy matching
}

export const cachedPrompts: CachedPrompt[] = [
  {
    questions: [
      "Should I hire Will?",
      "Should I hire you?",
      "Should we hire Will?",
      "Why should I hire Will?",
      "Why hire Will?",
    ],
    answer: "If you want technical depth combined with business acumen and proven leadership, absolutely yes. Will brings a rare combination: advanced AI expertise (XAI research, production ML models), real business experience (6-year business owner, franchise consulting), and demonstrated leadership (paid student government executive representing 50,000+ students). He doesn't just code - he delivers measurable business value.",
    keywords: ["hire", "should", "why", "employ", "recruit"],
  },
  {
    questions: [
      "What makes Will different from other CS graduates?",
      "What makes you different?",
      "How is Will different?",
      "What sets Will apart?",
      "Why choose Will over other candidates?",
      "What makes Will unique?",
    ],
    answer: "Most CS grads are purely technical. Will bridges three critical areas: (1) Advanced AI/ML with production experience, (2) Real business operations from owning Lawn Ranger for 6 years and consulting for DQ franchises, (3) Proven leadership through paid USG Executive Director role. He's deployed actual ML solutions that businesses use for scheduling and inventory, not just academic projects.",
    keywords: ["different", "unique", "special", "apart", "distinguish", "standout"],
  },
  {
    questions: [
      "What's Will's biggest professional achievement?",
      "What's your biggest achievement?",
      "What's Will's greatest accomplishment?",
      "What is Will most proud of?",
      "Tell me about Will's best work",
    ],
    answer: "Building and deploying an AI prediction model for a Dairy Queen franchise that incorporates weather data, events, and historical patterns to forecast business volume. It's currently in production use for scheduling and inventory management. This demonstrates his ability to take ML from concept to deployed business value - validated with real data and generating actual ROI.",
    keywords: ["achievement", "accomplishment", "proud", "best", "greatest", "biggest"],
  },
  {
    questions: [
      "Can Will handle both technical and business stakeholders?",
      "Can you work with non-technical people?",
      "How does Will communicate with business people?",
      "Can Will explain technical concepts to non-technical people?",
      "Is Will good with stakeholders?",
    ],
    answer: "Yes - this is one of his core strengths. As USG Executive Director, he represents 50,000+ students to university administration. In his DQ consulting, he navigates between franchise owners, POS integration teams, and technical implementation. He translates complex AI concepts into business value propositions that non-technical stakeholders understand and buy into.",
    keywords: ["stakeholder", "business", "technical", "communicate", "explain", "translate"],
  },
  {
    questions: [
      "What are Will's core technical skills?",
      "What technical skills does Will have?",
      "What can Will code in?",
      "What programming languages does Will know?",
      "What's your tech stack?",
      "What technologies do you use?",
    ],
    answer: "AI/ML: PyTorch, TensorFlow, Hugging Face, explainable AI, model interpretability. Full-stack: Python, JavaScript, C++, SQL, Svelte, Firebase, React. Systems: Assembly, machine architecture, cloud computing. Analysis: MATLAB, R, pandas, data visualization. He prefers PyTorch for development, Bayesian optimization for hyperparameter tuning, and has deployed production ML systems.",
    keywords: ["skills", "technical", "programming", "languages", "technologies", "stack", "code"],
  },
  {
    questions: [
      "Does Will have real work experience or just academic projects?",
      "Does Will have real experience?",
      "What work experience does Will have?",
      "Has Will worked in industry?",
      "Is Will's experience just academic?",
    ],
    answer: "Extensive real-world experience: Owned Lawn Ranger business for 6 years (2016-2022), 4 years at Target in customer service, startup experience at Vet2Go in Madrid and Havvi in St. Paul, digital marketing at Lone Leather. Currently runs freelance AI consulting. He's been working continuously since 2016 while maintaining Dean's List academics.",
    keywords: ["experience", "work", "real", "industry", "job", "employment", "professional"],
  },
  {
    questions: [
      "What kind of role is Will looking for?",
      "What job is Will looking for?",
      "What position does Will want?",
      "What's Will's ideal role?",
      "What type of work are you seeking?",
    ],
    answer: "Will excels in roles that combine technical AI/ML work with business application - ML engineering, AI consulting, technical product management, or solutions architecture. He's particularly strong in positions requiring stakeholder management, translating technical capabilities into business value, and deploying production ML systems. Startup or scale-up environments where he can have broad impact are ideal.",
    keywords: ["role", "job", "position", "looking", "seeking", "want", "ideal"],
  },
  {
    questions: [
      "What leadership experience does Will have?",
      "Has Will led teams?",
      "Does Will have leadership skills?",
      "Tell me about Will's leadership",
      "Has Will managed people?",
    ],
    answer: "Paid Executive Director of Relations for University of Minnesota's Undergraduate Student Government (USG), representing 50,000+ students with $2,500 annual stipend. Previously Director of Executive Relations and Chair of Technology Committee. Co-founded AI Applied UMN. Athletic captain for Nordic Cross Country and Track in high school. Led teams, managed budgets, developed policy, and coordinated stakeholders across multiple organizations.",
    keywords: ["leadership", "lead", "manage", "captain", "director", "executive", "team"],
  },
  {
    questions: [
      "When is Will available?",
      "When can Will start?",
      "What's Will's availability?",
      "When does Will graduate?",
      "Is Will available now?",
    ],
    answer: "Will is a senior at University of Minnesota graduating May 2026. He's currently employed as a researcher working with Professor Harman Kaur on XAI and Professor Paul Schrater on AI mental states inference. He's available for full-time positions starting May 2026.",
    keywords: ["available", "start", "when", "graduate", "graduation", "timeline"],
  },
  {
    questions: [
      "Can Will prove his work delivers results?",
      "Does Will have proven results?",
      "Has Will delivered real impact?",
      "Can Will show measurable outcomes?",
      "Does Will's work have ROI?",
    ],
    answer: "Yes - his DQ prediction model is in production use for actual business decisions (scheduling/inventory). His XAI research follows rigorous IRB protocols with measurable outcomes. Ran profitable lawn business for 6 years. Achieved Dean's List while managing paid leadership position, research, and consulting work. He validates everything with data before deployment and measures success by real-world utility, not just technical metrics.",
    keywords: ["results", "prove", "impact", "outcomes", "roi", "measurable", "delivered"],
  },
]

/**
 * Checks if the user's question matches any cached prompts
 * Uses case-insensitive exact matching and keyword matching
 */
export function findCachedResponse(userQuestion: string): string | null {
  const normalizedQuestion = userQuestion.toLowerCase().trim()

  // First, try exact/close matching
  for (const cached of cachedPrompts) {
    for (const question of cached.questions) {
      if (normalizedQuestion === question.toLowerCase()) {
        return cached.answer
      }
    }
  }

  // Then try keyword-based matching
  // Count how many keywords match in each cached prompt
  const matches = cachedPrompts.map(cached => {
    const keywordMatches = cached.keywords.filter(keyword =>
      normalizedQuestion.includes(keyword.toLowerCase())
    ).length

    return { cached, score: keywordMatches }
  })

  // Sort by score and return the best match if score is high enough
  matches.sort((a, b) => b.score - a.score)

  // Require at least 2 keyword matches to consider it a match
  if (matches[0].score >= 2) {
    return matches[0].cached.answer
  }

  return null
}
