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

@app.function(
    image=image,
    gpu="A10G",  # Use A10G GPU for good performance
    timeout=300,
    scaledown_window=120,
    volumes={"/model": volume}
)
@modal.asgi_app()
def fastapi_app():
    from fastapi import FastAPI, Request

    web_app = FastAPI()

    @web_app.post("/")
    async def generate_endpoint(request: Request):
        """Main generation endpoint"""
        from llama_cpp import Llama

        # Parse request
        body = await request.json()
        message = body.get("message", "")

        # Load your model (will be cached after first load)
        llm = Llama(
            model_path="/model/unsloth.Q4_K_M.gguf",
            temperature=0.7,
            top_p=0.9,
            n_ctx=2048,
            verbose=False
        )

        # Format prompt according to your template
        prompt = f"<|user|>\n{message}<|assistant|>\n"

        response = llm(
            prompt,
            max_tokens=512,
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