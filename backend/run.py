import os
import sys

# Add backend/ to Python path so `app` is importable by uvicorn worker processes
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)
os.environ["PYTHONPATH"] = backend_dir

import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
