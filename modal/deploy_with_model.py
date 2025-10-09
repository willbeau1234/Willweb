import modal
from modal import Image, App, web_endpoint
import os

app = App("unsloth-model-with-file")

# Create image with the model file included - use CUDA-enabled version for GPU
image = (
    Image.debian_slim()
    .pip_install([
        "llama-cpp-python[server]",
        "fastapi",
        "pydantic"
    ], extra_options="--extra-index-url https://abetlen.github.io/llama-cpp-python/whl/cu121")
    .add_local_file("./unsloth.Q4_K_M.gguf", "/model/unsloth.Q4_K_M.gguf")
)

# Global model instance - loaded once and cached
model_instance = None

def get_model():
    """Load model once and cache it"""
    global model_instance
    if model_instance is None:
        from llama_cpp import Llama
        print("Loading model (first time only)...")
        model_instance = Llama(
            model_path="/model/unsloth.Q4_K_M.gguf",
            n_ctx=4096,  # Context window size
            n_gpu_layers=-1,  # Use GPU for all layers (-1 = all)
            n_threads=4,  # CPU threads for parts not on GPU
            verbose=False
        )
        print("Model loaded successfully!")
    return model_instance

@app.function(
    image=image,
    gpu="A10G",
    timeout=300,
    keep_warm=1,  # Keep 1 instance warm to avoid cold starts
    container_idle_timeout=300,  # Keep container alive for 5 minutes
)
@web_endpoint(method="POST")
def generate(request: dict):
    # Get cached model instance
    llm = get_model()

    prompt = f"<|user|>\n{request['message']}<|assistant|>\n"

    response = llm(
        prompt,
        max_tokens=512,
        temperature=0.7,
        top_p=0.9,
        stop=["<|end_of_text|>", "<|user|>"],
        echo=False
    )

    return {"response": response['choices'][0]['text'].strip()}

@app.function(image=image)
@web_endpoint(method="GET")
def health():
    return {"status": "healthy"}