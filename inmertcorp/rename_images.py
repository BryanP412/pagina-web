from pathlib import Path
import re

BASE_DIR = Path("img")
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".avif"}

if not BASE_DIR.exists():
    print("❌ No existe la carpeta img/")
    exit()

for folder in BASE_DIR.iterdir():
    if not folder.is_dir():
        continue

    category = folder.name.lower()

    # patrón: categoria1.jpg, categoria23.png
    pattern = re.compile(rf"^{category}\d+$", re.IGNORECASE)

    files = [
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in EXTS
    ]

    if not files:
        continue

    already_named = []
    to_rename = []

    for f in files:
        if pattern.match(f.stem):
            already_named.append(f)
        else:
            to_rename.append(f)

    # buscar el último número usado
    max_num = 0
    for f in already_named:
        m = re.search(r"\d+", f.stem)
        if m:
            max_num = max(max_num, int(m.group()))

    # ordenar nuevos por fecha (viejo → nuevo)
    to_rename.sort(key=lambda f: f.stat().st_mtime)

    print(f"\n📂 {folder.name} (empieza en {max_num + 1})")

    for i, file in enumerate(to_rename, start=max_num + 1):
        new_name = f"{category}{i}{file.suffix.lower()}"
        file.rename(folder / new_name)
        print(f"🔄 {file.name} → {new_name}")
