import sys
from pathlib import Path

# Streamlit App Entrypoint
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Import and execute main streamlit app
import streamlit_app
