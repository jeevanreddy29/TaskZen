import os
import sys

# Add the root directory to the path so we can import 'server' as a package
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(root_dir)

from server.main import app

# This is for Vercel's serverless function requirement
# The variable must be named 'app'
