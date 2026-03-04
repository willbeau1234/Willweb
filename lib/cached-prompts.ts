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
    answer: "If you want technical depth combined with business acumen and proven leadership, absolutely yes. Will brings a rare combination: advanced AI expertise (XAI research at UMN, production ML models for Dairy Queen franchises), international startup experience (Vet2Go in Madrid), and demonstrated leadership (USG Executive Affairs Director managing a team of 10). He's fluent in Spanish and delivers measurable business value - his DQ system reduced analysis time by 40%.",
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
    answer: "Most CS grads are purely technical. Will bridges three critical areas: (1) Advanced AI/ML with production experience deploying systems for 3 Dairy Queen locations, (2) International experience from his software internship at Vet2Go in Madrid, (3) Proven leadership as USG Executive Affairs Director managing a team of 10. He also holds dual degrees in CS and Economics (Quantitative Emphasis), giving him a unique analytical perspective.",
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
    answer: "Building and deploying a custom AI system for 3 Dairy Queen locations that automates sales, inventory, and scheduling analysis - reducing analysis time by 40%. He's now in discussions with PAR POS systems for an API agreement to scale this across multiple franchises. This demonstrates his ability to take ML from concept to deployed business value with measurable ROI.",
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
    answer: "AI/ML: PyTorch, Jax, Hugging Face, neural networks, deep learning, reinforcement learning. Full-stack: Python, JavaScript, C++, Java, C, SQL, Svelte, React, HTML. Systems: Assembly language, cloud computing. Analysis: MATLAB, R, ArcGIS Pro, data visualization. He's also fluent in Spanish, which has enabled international work experience.",
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
    answer: "Extensive real-world experience: Currently a researcher at UMN on XAI (Jan 2025-present), runs freelance AI consulting for Dairy Queen franchises (Dec 2024-present), software intern at Vet2Go startup in Madrid (Sep-Dec 2024), and researcher at UC Berkeley/University of Iowa on neutrino detection (May-Sep 2024). He's shipped production code that businesses rely on daily.",
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
    answer: "Executive Affairs Director for University of Minnesota's Undergraduate Student Government (USG) since January 2025. He advises the USG President on policy recommendations to the University President while directing a team of 10 (two directors and eight interns) across sustainability, food insecurity, and executive affairs initiatives. He's secured funding for campus projects, organized university-wide town halls, and hosted an all-campus sustainability conference. Also an Eagle Scout (May 2022).",
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
    answer: "Will is a senior at University of Minnesota graduating May 2026 with a dual degree in Computer Science and Economics (Quantitative Emphasis). He's currently employed as a researcher on XAI and runs freelance AI consulting for Dairy Queen franchises. He's available for full-time positions starting May 2026.",
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
    answer: "Yes - his DQ AI system reduced analysis time by 40% for 3 franchise locations and he's now negotiating API access with PAR POS systems to scale further. His Vet2Go website enabled record profits for the startup. His UC Berkeley/Iowa research delivered data visualizations to project stakeholders. He measures success by real-world utility, not just technical metrics.",
    keywords: ["results", "prove", "impact", "outcomes", "roi", "measurable", "delivered"],
  },
  // Education & Academic
  {
    questions: [
      "Where did Will go to school?",
      "Where does Will study?",
      "What's Will's education?",
      "Where is Will studying?",
      "What university does Will attend?",
      "What's Will's degree?",
    ],
    answer: "Will is a senior at the University of Minnesota - Twin Cities, pursuing dual degrees in Computer Science (College of Science and Engineering) and Economics with a Quantitative Emphasis (College of Liberal Arts). He graduates in May 2026 with a 3.4 GPA. He's currently conducting research on explainable AI.",
    keywords: ["school", "university", "education", "study", "degree", "college", "academic", "minnesota"],
  },
  {
    questions: [
      "What research is Will doing?",
      "Tell me about Will's research",
      "What is Will researching?",
      "Does Will do research?",
      "What's Will's academic research?",
    ],
    answer: "Will is currently a researcher at University of Minnesota (Jan 2025-present) working on explainable AI (XAI) - improving model interpretability to enhance fact-checking capabilities and trust in AI-generated responses. He develops XAI techniques, confidence scoring, and provenance tracking. Previously, he researched at UC Berkeley and University of Iowa (May-Sep 2024) on neutrino detection, developing autonomous data visualization code for stakeholders.",
    keywords: ["research", "lab", "professor", "academic", "xai", "explainable"],
  },
  // Projects & Portfolio
  {
    questions: [
      "What projects has Will worked on?",
      "Tell me about Will's projects",
      "What has Will built?",
      "Show me Will's portfolio",
      "What are Will's side projects?",
    ],
    answer: "Key projects include: (1) DQ AI System - production ML for 3 Dairy Queen locations automating sales, inventory, and scheduling analysis. (2) Democracy Daily - full-stack civic discussion platform with AI-powered debate system where users can 'battle' an LLM in policy discussions. (3) Vet2Go website - full-stack development for a Madrid-based veterinary startup. (4) This portfolio site with AI chat assistant.",
    keywords: ["projects", "portfolio", "built", "created", "developed", "work", "github"],
  },
  // AI & Machine Learning Specific
  {
    questions: [
      "Does Will know machine learning?",
      "What ML experience does Will have?",
      "Can Will build AI systems?",
      "What's Will's AI experience?",
      "Has Will worked with neural networks?",
      "Does Will know deep learning?",
    ],
    answer: "Yes - Will has both academic and production ML experience. He's built production AI systems using PyTorch and Jax, with expertise in neural networks, deep learning, and reinforcement learning. His XAI research focuses on model interpretability and confidence scoring. He's deployed real AI solutions for Dairy Queen franchises that reduced analysis time by 40%.",
    keywords: ["machine", "learning", "ml", "ai", "neural", "deep", "model", "pytorch", "tensorflow"],
  },
  // Freelance & Consulting
  {
    questions: [
      "Does Will do freelance work?",
      "Tell me about Will's consulting",
      "What's Will's freelance experience?",
      "Does Will do AI consulting?",
      "Tell me about the Dairy Queen project",
    ],
    answer: "Will runs Freelance AI Solutions (Dec 2024-present), where he developed a custom AI system for 3 Dairy Queen locations that automates sales, inventory, and scheduling analysis - reducing analysis time by 40%. He's currently in discussions with PAR POS systems for an API agreement that would allow scaling to multiple Dairy Queen franchises.",
    keywords: ["freelance", "consulting", "dairy", "queen", "dq", "business", "client"],
  },
  // Contact & Communication
  {
    questions: [
      "How can I contact Will?",
      "What's Will's email?",
      "How do I reach Will?",
      "Can I get in touch with Will?",
      "What's the best way to contact Will?",
    ],
    answer: "You can reach Will through the contact form on this website, or connect with him on LinkedIn. He's responsive and happy to discuss opportunities, collaborations, or answer questions about his work. For professional inquiries, the contact form is the best starting point.",
    keywords: ["contact", "email", "reach", "touch", "connect", "linkedin", "message"],
  },
  // Personality & Work Style
  {
    questions: [
      "What's Will like to work with?",
      "How does Will work?",
      "What's Will's work style?",
      "Is Will a team player?",
      "What's Will's personality?",
    ],
    answer: "Will is collaborative, direct, and results-oriented. He communicates clearly with both technical and non-technical stakeholders. His leadership roles (USG Executive Director, club co-founder) demonstrate he works well in teams. He's proactive about solving problems and values efficiency - he'd rather ship something useful than perfect something endlessly.",
    keywords: ["work", "style", "personality", "team", "collaborate", "like"],
  },
  // Location & Remote Work
  {
    questions: [
      "Where is Will located?",
      "Where does Will live?",
      "Can Will work remotely?",
      "Is Will open to relocation?",
      "What location is Will in?",
    ],
    answer: "Will is based in Minneapolis, Minnesota (Twin Cities area). He's open to remote work, hybrid arrangements, or relocation for the right opportunity. His experience with distributed teams and async communication makes him effective in remote environments.",
    keywords: ["located", "location", "live", "remote", "relocate", "minneapolis", "minnesota", "where"],
  },
  // Salary & Compensation (deflect gracefully)
  {
    questions: [
      "What's Will's salary expectation?",
      "How much does Will want to be paid?",
      "What's Will's expected compensation?",
      "What salary is Will looking for?",
    ],
    answer: "Compensation expectations depend on the role, location, and overall package. Will is flexible and more focused on finding the right opportunity with growth potential than maximizing starting salary. He's happy to discuss specifics once there's mutual interest in a role.",
    keywords: ["salary", "compensation", "pay", "money", "expectation", "paid"],
  },
  // Hobbies & Interests
  {
    questions: [
      "What are Will's hobbies?",
      "What does Will do for fun?",
      "What are Will's interests outside work?",
      "Does Will have hobbies?",
      "What does Will do in free time?",
    ],
    answer: "Will is an endurance athlete - he was captain of both Nordic Cross Country and Track teams in high school. He enjoys outdoor activities, staying active, and continuous learning. He's genuinely curious about AI/ML beyond just work applications and keeps up with research developments in the field.",
    keywords: ["hobbies", "fun", "interests", "free", "time", "outside", "sports", "athletic"],
  },
  // Strengths & Weaknesses
  {
    questions: [
      "What are Will's strengths?",
      "What is Will good at?",
      "What are Will's best qualities?",
      "Where does Will excel?",
    ],
    answer: "Key strengths: (1) Bridging technical and business domains - he can build the ML model AND explain its ROI to stakeholders. (2) Production mindset - focuses on deploying working solutions, not just prototypes. (3) Communication - clear, direct, adapts to audience. (4) Self-directed - runs businesses, research, and projects independently while collaborating effectively in teams.",
    keywords: ["strengths", "good", "best", "excel", "qualities", "strong"],
  },
  {
    questions: [
      "What are Will's weaknesses?",
      "What is Will bad at?",
      "Where does Will need improvement?",
      "What are Will's areas for growth?",
    ],
    answer: "Will is direct and results-focused, which means he sometimes prioritizes shipping over polish. He's working on balancing speed with thoroughness. He's also earlier in his career than senior candidates, though he compensates with real-world business experience and production deployments that many new grads lack.",
    keywords: ["weaknesses", "bad", "improvement", "growth", "weak", "lacking"],
  },
  // General greetings and conversation
  {
    questions: [
      "Hello",
      "Hi",
      "Hey",
      "Hi there",
      "Hello there",
      "Howdy",
    ],
    answer: "Hi! I'm Will's AI assistant. I can tell you about his skills, experience, projects, or help answer any questions you have about working with him. What would you like to know?",
    keywords: ["hello", "hi", "hey", "howdy", "greetings"],
  },
  {
    questions: [
      "Who is Will?",
      "Tell me about Will",
      "Who are you?",
      "What is this?",
      "Introduce Will",
      "Give me an overview of Will",
    ],
    answer: "Will is a senior at University of Minnesota graduating May 2026 with dual degrees in Computer Science and Economics (Quantitative Emphasis). He combines technical AI/ML expertise with real business impact - his AI system for Dairy Queen franchises reduced analysis time by 40%. He's currently a researcher on explainable AI, serves as USG Executive Affairs Director leading a team of 10, and is fluent in Spanish. He's an Eagle Scout and looking for roles where he can apply AI to solve real business problems.",
    keywords: ["who", "about", "tell", "introduce", "overview", "will"],
  },
  {
    questions: [
      "Thank you",
      "Thanks",
      "Thanks!",
      "Thank you!",
      "Appreciate it",
    ],
    answer: "You're welcome! Feel free to ask if you have any other questions about Will's experience or qualifications. Good luck with your search!",
    keywords: ["thank", "thanks", "appreciate"],
  },
  // Internship specific
  {
    questions: [
      "Is Will looking for an internship?",
      "Does Will want an internship?",
      "Is Will available for internship?",
      "Internship opportunities for Will?",
    ],
    answer: "Will is graduating in May 2026 and is primarily focused on full-time opportunities. However, he's open to discussing substantial internship roles that could convert to full-time, especially in AI/ML or roles with significant responsibility and learning potential.",
    keywords: ["internship", "intern", "summer"],
  },
  // Why this field / motivation
  {
    questions: [
      "Why is Will interested in AI?",
      "Why did Will choose CS?",
      "What motivates Will?",
      "Why does Will want to work in tech?",
      "What drives Will?",
    ],
    answer: "Will is drawn to AI because it's where technical depth meets real-world impact. His work on the DQ prediction model showed him how ML can directly improve business operations. His XAI research reflects his belief that AI should be understandable and trustworthy. He's motivated by building things that actually get used and create measurable value.",
    keywords: ["why", "interested", "motivate", "drive", "passion", "choose"],
  },
  // References
  {
    questions: [
      "Does Will have references?",
      "Can Will provide references?",
      "Who can vouch for Will?",
      "Does Will have recommendations?",
    ],
    answer: "Yes - Will can provide professional and academic references upon request. These include his research supervisors at UMN and UC Berkeley/Iowa, colleagues from his USG leadership role, and business contacts from his Dairy Queen consulting work. References are available at the appropriate stage of the hiring process.",
    keywords: ["references", "recommend", "vouch", "referral"],
  },
  // International / Spain experience
  {
    questions: [
      "Has Will worked internationally?",
      "Does Will have international experience?",
      "Tell me about Will's time in Spain",
      "Tell me about Vet2Go",
      "Has Will worked abroad?",
    ],
    answer: "Yes - Will worked as a Software Intern at Vet2Go in Madrid, Spain (Sep-Dec 2024). He managed front- and back-end development for this veterinary startup, creating a website that improved UI interaction and data collection, enabling Vet2Go to have record profits. His fluency in Spanish made him effective in this international role.",
    keywords: ["international", "spain", "madrid", "abroad", "vet2go", "veterinary", "spanish"],
  },
  // Spanish language
  {
    questions: [
      "Does Will speak Spanish?",
      "What languages does Will speak?",
      "Is Will bilingual?",
      "Can Will speak other languages?",
    ],
    answer: "Yes - Will is fluent in Spanish. This enabled him to work effectively as a software intern at Vet2Go in Madrid, Spain. Being bilingual is an asset for international teams and Spanish-speaking markets.",
    keywords: ["spanish", "language", "bilingual", "fluent", "speak"],
  },
  // Democracy Daily project
  {
    questions: [
      "What is Democracy Daily?",
      "Tell me about the debate platform",
      "What's the civic discussion project?",
      "Tell me about the AI debate system",
    ],
    answer: "Democracy Daily is a full-stack civic discussion platform Will built (June-Aug 2025) that enables structured public debate and real-time argument exchange with AI agents. Users can 'battle' an LLM in policy discussions through an AI-powered debate system that generates dynamic counterarguments. It features a scalable backend and modular frontend supporting persistent threads, moderation workflows, and daily publication delivery.",
    keywords: ["democracy", "daily", "debate", "civic", "discussion", "platform", "policy"],
  },
  // Eagle Scout
  {
    questions: [
      "Is Will an Eagle Scout?",
      "What awards does Will have?",
      "Tell me about Will's achievements",
      "Does Will have any honors?",
    ],
    answer: "Yes - Will earned his Eagle Scout rank in May 2022, demonstrating leadership, community service, and perseverance. Combined with his Executive Affairs Director role at USG, these experiences show a consistent pattern of taking on responsibility and leading initiatives.",
    keywords: ["eagle", "scout", "award", "honor", "achievement", "bsa"],
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
