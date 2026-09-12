import re
from pathlib import Path

xml = Path(r"e:\money-mails-mobile-20-5-2026\play-console\phone-screenshots\_ui.xml").read_text(
    encoding="utf-8", errors="ignore"
)
pat = re.compile(
    r'text="([^"]*)"[^>]*content-desc="([^"]*)"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"'
)
for m in pat.finditer(xml):
    text, desc, x1, y1, x2, y2 = m.group(1), m.group(2), *map(int, m.groups()[2:])
    if text or desc:
        print(f"[{x1},{y1}][{x2},{y2}] text={text!r} desc={desc!r}")
