"""Generiert PDFs aus den Markdown-Versionen der rechtlichen Pages.

Nutzt:
- Python `markdown` für MD -> HTML
- Chrome Headless für HTML -> PDF (--print-to-pdf)

Output: docs/legal/*.pdf

Aufruf:
    python scripts/generate-legal-pdfs.py
"""
import subprocess
import sys
from pathlib import Path

try:
    import markdown
except ImportError:
    print("Installiere markdown: pip install markdown", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parents[1]
LEGAL_DIR = ROOT / "docs" / "legal"
CHROME = Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")

if not CHROME.exists():
    print(f"Chrome nicht gefunden: {CHROME}", file=sys.stderr)
    sys.exit(1)

CSS = """
@page {
    size: A4;
    margin: 22mm 18mm;
    @bottom-right {
        content: "Seite " counter(page) " / " counter(pages);
        font-family: Georgia, serif;
        font-size: 9pt;
        color: #666;
    }
}
body {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11pt;
    line-height: 1.55;
    color: #111;
    max-width: 175mm;
    margin: 0 auto;
}
h1 {
    font-size: 24pt;
    margin: 0 0 0.6em 0;
    border-bottom: 1px solid #999;
    padding-bottom: 0.3em;
    font-weight: 600;
}
h2 {
    font-size: 14pt;
    margin: 1.6em 0 0.4em 0;
    font-weight: 600;
    color: #222;
}
h3 {
    font-size: 11.5pt;
    margin: 1.2em 0 0.3em 0;
    font-weight: 600;
}
p { margin: 0.6em 0; }
ul, ol { margin: 0.6em 0; padding-left: 1.6em; }
li { margin: 0.3em 0; }
strong { font-weight: 700; }
em { font-style: italic; }
code {
    background: #f0eee9;
    padding: 1px 4px;
    border-radius: 2px;
    font-family: "Courier New", monospace;
    font-size: 0.92em;
}
a {
    color: #6b4f1f;
    text-decoration: none;
    border-bottom: 1px solid #c4b282;
}
hr {
    border: 0;
    border-top: 1px solid #ccc;
    margin: 2em 0 1em;
}
footer {
    margin-top: 3em;
    padding-top: 1em;
    border-top: 1px solid #999;
    font-size: 9pt;
    color: #555;
}
"""

HEADER_HTML = """
<div style="margin-bottom: 1.5em; padding-bottom: 0.8em; border-bottom: 1px solid #c4b282; font-family: Georgia, serif; font-size: 9pt; color: #555;">
    <strong>Landhotel Schend</strong> · Hauptstraße 9 · 54552 Immerath · Telefon +49 6573 306 · info@landhaus-schend.de
</div>
"""

DOCS = [
    ("impressum.md", "Impressum"),
    ("datenschutz.md", "Datenschutzerklärung"),
    ("agb.md", "Allgemeine Geschäftsbedingungen"),
    ("barrierefreiheit.md", "Erklärung zur Barrierefreiheit"),
]


def md_to_html(md_text: str, title: str) -> str:
    body = markdown.markdown(md_text, extensions=["extra", "sane_lists", "smarty"])
    return f"""<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>{title} — Landhotel Schend</title>
<style>{CSS}</style>
</head>
<body>
{HEADER_HTML}
{body}
</body>
</html>"""


def generate_pdf(md_path: Path, title: str) -> Path:
    html_path = md_path.with_suffix(".html")
    pdf_path = md_path.with_suffix(".pdf")

    html = md_to_html(md_path.read_text(encoding="utf-8"), title)
    html_path.write_text(html, encoding="utf-8")

    cmd = [
        str(CHROME),
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        f"file:///{html_path.as_posix()}",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        raise RuntimeError(f"Chrome PDF failed: {r.stderr[:500]}")
    return pdf_path


def main() -> int:
    if not LEGAL_DIR.exists():
        print(f"Verzeichnis nicht gefunden: {LEGAL_DIR}", file=sys.stderr)
        return 1

    for filename, title in DOCS:
        md_path = LEGAL_DIR / filename
        if not md_path.exists():
            print(f"  SKIP {filename} — nicht vorhanden")
            continue
        try:
            pdf = generate_pdf(md_path, title)
            size_kb = pdf.stat().st_size // 1024
            print(f"  OK   {pdf.name} ({size_kb} KB)")
        except Exception as e:
            print(f"  FAIL {filename}: {e}")
            return 1

    print(f"\nFertig — PDFs in {LEGAL_DIR}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
