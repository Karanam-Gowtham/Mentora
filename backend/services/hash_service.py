import hashlib
import json
import os


def compute_file_hash(file_path):

    if not os.path.exists(file_path):
        return None

    with open(file_path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()