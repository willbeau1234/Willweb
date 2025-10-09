import modal
from modal import Image, App, web_endpoint
import os

app = App("unsloth-model-with-file")

# Create image with the model file included
image = (
    Image.debian_slim()
    .pip_install([
        "llama-cpp-python[server]",
        "fastapi", 
        "pydantic"
    ])
    .add_local_file("./unsloth.Q4_K_M.gguf", "/model/unsloth.Q4_K_M.gguf")
)

@app.function(
    image=image,
    gpu="A10G",
    timeout=300,
    scaledown_window=120,  # Updated parameter name
)
@web_endpoint(method="POST") 
def generate(request: dict):
    from llama_cpp import Llama
    
    # Load model from the image
    llm = Llama(
        model_path="/model/unsloth.Q4_K_M.gguf",
        temperature=0.7,
        top_p=0.9,
        n_ctx=2048,
        verbose=False
    )
    
    prompt = f"<|user|>\n{request['message']}<|assistant|>\n"
    
    response = llm(
        prompt,
        max_tokens=512,
        stop=["<|end_of_text|>", "<|user|>"],
        echo=False
    )
    
    return {"response": response['choices'][0]['text'].strip()}

@app.function(image=image)
@web_endpoint(method="GET")
def health():
    return {"status": "healthy"}