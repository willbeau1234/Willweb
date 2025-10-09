import modal

app = modal.App("upload-model")

# Get the volume
volume = modal.Volume.from_name("model-volume", create_if_missing=True)

# Create a simple image
image = modal.Image.debian_slim()

@app.function(
    image=image,
    volumes={"/model": volume},
    timeout=1200  # 20 minutes for large file upload
)
def upload_model_to_volume():
    import os

    # Check if model already exists
    if os.path.exists("/model/unsloth.Q4_K_M.gguf"):
        size = os.path.getsize("/model/unsloth.Q4_K_M.gguf")
        print(f"Model already exists in volume! Size: {size / (1024**3):.2f} GB")
        return

    print("Model file not found in volume. You need to upload it using Modal CLI.")
    print("Run: modal volume put model-volume unsloth.Q4_K_M.gguf /unsloth.Q4_K_M.gguf")

@app.local_entrypoint()
def main():
    upload_model_to_volume.remote()