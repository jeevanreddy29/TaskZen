import os
import sys

# Add the root and server directories to the path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
server_dir = os.path.join(root_dir, "server")
ai_dir = os.path.join(server_dir, "ai")

sys.path.append(root_dir)
sys.path.append(server_dir)
sys.path.append(ai_dir)

from server.main import app

# This is for Vercel's serverless function requirement
# The variable must be named 'app'
