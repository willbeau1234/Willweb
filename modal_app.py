import modal
from modal import Image, App, Volume

app = App("unsloth-model")

# Create volume to store the model
volume = Volume.from_name("model-volume", create_if_missing=True)

# Create image with required dependencies - CPU-only for faster cold start
image = (
    Image.debian_slim()
    .pip_install("llama-cpp-python", "fastapi", "pydantic")
)

# System prompt - kept concise for small model
SYSTEM_PROMPT = """You are an AI assistant for Will Beaumaster's portfolio. Answer in 2-3 sentences only.

WILL'S INFO:
- UMN senior (CS + Economics), graduating May 2026, GPA 3.4, fluent in Spanish
- Current: AI researcher at UMN (XAI), freelance AI (Dairy Queen automation -40% analysis time), USG Executive Director (leads team of 10)
- Past: Vet2Go Madrid (full-stack dev), UC Berkeley/Iowa (neutrino research)
- Skills: Python, PyTorch, Jax, React, C++, Java, JavaScript, SQL
- Projects: Operation Lens AI, Democracy Daily, Vet2Go website
- Eagle Scout, available May 2026

Keep answers SHORT (2-3 sentences). Be specific about Will's achievements."""

@app.cls(
    image=image,
    cpu=4,  # More CPU cores for faster inference
    memory=4096,  # 4GB RAM
    timeout=300,
    scaledown_window=300,  # Keep container warm for 5 minutes
    volumes={"/model": volume}
)
class Model:
    @modal.enter()
    def load_model(self):
        """Load model once when container starts"""
        from llama_cpp import Llama
        self.llm = Llama(
            model_path="/model/qwen2.5-0.5b-instruct-q4_k_m.gguf",
            n_ctx=2048,  # Need enough for system prompt + response
            n_threads=4,  # Use all CPU cores
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

            # Qwen2.5 chat format
            prompt = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"

            response = llm(
                prompt,
                max_tokens=200,  # Enough for a short paragraph
                temperature=0.7,
                top_p=0.9,
                stop=["<|im_end|>", "<|im_start|>"],
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