import shutil
import os

def sync():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(root, 'android', 'app', 'src', 'main', 'assets')

    os.makedirs(assets_dir, exist_ok=True)

    # Directories to copy
    for d in ['css', 'js', 'assets']:
        src = os.path.join(root, d)
        dst = os.path.join(assets_dir, d)
        if os.path.exists(dst):
            shutil.rmtree(dst)
        if os.path.exists(src):
            shutil.copytree(src, dst)

    # Core files to copy
    for f in ['index.html', 'manifest.json', 'sw.js']:
        src = os.path.join(root, f)
        dst = os.path.join(assets_dir, f)
        if os.path.exists(src):
            shutil.copy2(src, dst)

    print("Successfully synchronized web assets into Android APK project assets!")

if __name__ == '__main__':
    sync()
