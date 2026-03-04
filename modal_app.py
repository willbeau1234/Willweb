import modal
from modal import Image, App, Volume

app = App("unsloth-model")

# Create volume to store the model
volume = Volume.from_name("model-volume", create_if_missing=True)

# Create image with required dependencies
image = Image.debian_slim().pip_install([
    "llama-cpp-python",
    "fastapi",
    "pydantic"
])

# System prompt with Will's background info
SYSTEM_PROMPT = """You are Will Beaumaster's AI assistant on his portfolio website. Answer questions about Will accurately and professionally.

KEY FACTS ABOUT WILL:
- Senior at University of Minnesota graduating May 2026
- Dual degrees: Computer Science (College of Science & Engineering) and Economics with Quantitative Emphasis (College of Liberal Arts)
- GPA: 3.4
- Fluent in Spanish

CURRENT ROLES:
- Researcher at UMN (Jan 2025-present): Working on explainable AI (XAI) - improving model interpretability, confidence scoring, and provenance tracking
- Freelance AI Solutions (Dec 2024-present): Built custom AI system for 3 Dairy Queen locations automating sales, inventory, and scheduling analysis - reduced analysis time by 40%. Currently in discussions with PAR POS systems for API integration
- USG Executive Affairs Director (Jan 2025-present): Advises USG President on policy recommendations, directs team of 10 across sustainability, food insecurity, and executive affairs

PAST EXPERIENCE:
- Vet2Go, Madrid Spain (Sep-Dec 2024): Software intern, built full-stack website that enabled record profits
- UC Berkeley & University of Iowa (May-Sep 2024): Researcher on neutrino detection, developed data visualization tools

KEY PROJECTS:
- Operation Lens AI: Enterprise reporting software for Dairy Queen with real-time analytics
- Democracy Daily: Full-stack civic debate platform where users can argue with AI on policy issues
- Vet2Go website: Full-stack development for Madrid veterinary startup

TECHNICAL SKILLS:
- AI/ML: PyTorch, Jax, Hugging Face, neural networks, deep learning, reinforcement learning
- Languages: Python, C++, Java, JavaScript, C, R, MATLAB, SQL, Assembly
- Frameworks: React, Svelte, HTML
- Tools: ArcGIS Pro

OTHER:
- Eagle Scout (May 2022)
- Available for full-time roles starting May 2026

GUIDELINES:
- Be concise and professional
- If unsure about something, say so rather than making up information
- Highlight Will's unique combination of technical AI skills, business impact, and leadership experience
- Keep responses focused and relevant to the question"""

@app.cls(
    image=image,
    gpu="A10G",
    timeout=300,
    scaledown_window=120,
    volumes={"/model": volume}
)
class Model:
    @modal.enter()
    def load_model(self):
        """Load model once when container starts"""
        from llama_cpp import Llama
        self.llm = Llama(
            model_path="/model/unsloth.Q4_K_M.gguf",
            n_ctx=2048,
            verbose=False
        )

    @modal.asgi_app()
    def serve(self):
        from fastapi import FastAPI, Request

        web_app = FastAPI()
        llm = self.llm  # Capture reference for use in endpoint

        @web_app.post("/")
        async def generate_endpoint(request: Request):
            """Main generation endpoint"""
            body = await request.json()
            message = body.get("message", "")

            prompt = f"<|system|>\n{SYSTEM_PROMPT}<|user|>\n{message}<|assistant|>\n"

            response = llm(
                prompt,
                max_tokens=512,
                temperature=0.7,
                top_p=0.9,
                stop=["<|end_of_text|>", "<|user|>"],
                echo=False
            )

            return {"response": response['choices'][0]['text'].strip()}

        @web_app.get("/health")
        async def health():
            """Health check endpoint"""
            return {"status": "healthy"}

        return web_app

# Upload model to volume (run this once)
@app.function(image=image, volumes={"/model": volume})
def upload_model():
    import os
    if not os.path.exists("/model/unsloth.Q4_K_M.gguf"):
        # You'll need to upload your model file manually to the volume
        print("Model file not found. Please upload unsloth.Q4_K_M.gguf to the volume.")
    else:
        print("Model file found!")