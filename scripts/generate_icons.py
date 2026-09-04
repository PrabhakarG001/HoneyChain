import os
import subprocess
from PIL import Image

def render_html_to_png(html_content, output_png_path, width, height):
    os.makedirs(os.path.dirname(output_png_path), exist_ok=True)
    temp_html = output_png_path + ".temp.html"
    temp_png = output_png_path + ".temp.png"

    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        f"--screenshot={os.path.abspath(temp_png)}",
        f"--window-size={width},{height}",
        "--default-background-color=00000000",
        os.path.abspath(temp_html)
    ]
    subprocess.run(cmd, capture_output=True, text=True, check=True)

    # Open rendered image and resize cleanly if needed
    img = Image.open(temp_png)
    if img.size != (width, height):
        img = img.resize((width, height), Image.Resampling.LANCZOS)
    img.save(output_png_path, "PNG")

    # Cleanup temp files
    if os.path.exists(temp_html):
        os.remove(temp_html)
    if os.path.exists(temp_png):
        os.remove(temp_png)

    print(f"Generated {output_png_path} ({width}x{height})")

# HTML Template generator
def make_html(svg_body, bg_color="transparent", padding="10%"):
    return f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{
    width: 100%;
    height: 100%;
    background: {bg_color};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }}
  .container {{
    width: 100%;
    height: 100%;
    padding: {padding};
    display: flex;
    align-items: center;
    justify-content: center;
  }}
  svg {{
    width: 100%;
    height: 100%;
  }}
</style>
</head>
<body>
<div class="container">
{svg_body}
</div>
</body>
</html>"""

# SVG Bodies
# 1. Standard logo (transparent, amber hex, amber left link, dark right link)
svg_standalone_light = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M 50 8 L 88 30 L 88 70 L 50 92 L 12 70 L 12 30 Z" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round" fill="none"/>
  <path d="M 32 40 C 32 30, 48 30, 48 40 L 48 60 C 48 70, 32 70, 32 60 Z" stroke="#F59E0B" stroke-width="5" fill="none"/>
  <path d="M 52 40 C 52 30, 68 30, 68 40 L 68 60 C 68 70, 52 70, 52 60 Z" stroke="#111827" stroke-width="5" fill="none"/>
</svg>"""

# 2. Standalone dark/light high contrast (white right link for dark backgrounds)
svg_standalone_dark = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M 50 8 L 88 30 L 88 70 L 50 92 L 12 70 L 12 30 Z" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round" fill="none"/>
  <path d="M 32 40 C 32 30, 48 30, 48 40 L 48 60 C 48 70, 32 70, 32 60 Z" stroke="#F59E0B" stroke-width="5" fill="none"/>
  <path d="M 52 40 C 52 30, 68 30, 68 40 L 68 60 C 68 70, 52 70, 52 60 Z" stroke="#F9FAFB" stroke-width="5" fill="none"/>
</svg>"""

# 3. Favicon specific (All amber + dark accents, optimized for visibility at 16-64px)
svg_favicon = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M 50 8 L 88 30 L 88 70 L 50 92 L 12 70 L 12 30 Z" stroke="#F59E0B" stroke-width="8" stroke-linejoin="round" fill="none"/>
  <path d="M 32 40 C 32 30, 48 30, 48 40 L 48 60 C 48 70, 32 70, 32 60 Z" stroke="#F59E0B" stroke-width="7" fill="none"/>
  <path d="M 52 40 C 52 30, 68 30, 68 40 L 68 60 C 68 70, 52 70, 52 60 Z" stroke="#111827" stroke-width="7" fill="none"/>
</svg>"""

print("Rendering Favicon...")
render_html_to_png(make_html(svg_favicon, "transparent", "5%"), "assets/favicon.png", 192, 192)

print("Rendering App Icon...")
render_html_to_png(make_html(svg_standalone_dark, "#0B0C10", "18%"), "assets/icon.png", 1024, 1024)

print("Rendering Splash Icon...")
render_html_to_png(make_html(svg_standalone_dark, "transparent", "10%"), "assets/splash-icon.png", 512, 512)

print("Rendering Android Foreground...")
render_html_to_png(make_html(svg_standalone_dark, "transparent", "20%"), "assets/android-icon-foreground.png", 512, 512)

print("Rendering Android Monochrome...")
render_html_to_png(make_html(svg_standalone_light, "transparent", "20%"), "assets/android-icon-monochrome.png", 512, 512)

# Write updated SVG files to assets/brand
with open("assets/brand/honeychain_standalone_icon.svg", "w", encoding="utf-8") as f:
    f.write(svg_standalone_light)

with open("assets/brand/honeychain_transparent_bg.svg", "w", encoding="utf-8") as f:
    f.write(svg_standalone_light)

app_icon_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="115" fill="#0B0C10"/>
  <g transform="translate(106, 106) scale(3.0)">
    <path d="M 50 8 L 88 30 L 88 70 L 50 92 L 12 70 L 12 30 Z" stroke="#F59E0B" stroke-width="6" stroke-linejoin="round" fill="none"/>
    <path d="M 32 40 C 32 30, 48 30, 48 40 L 48 60 C 48 70, 32 70, 32 60 Z" stroke="#F59E0B" stroke-width="5" fill="none"/>
    <path d="M 52 40 C 52 30, 68 30, 68 40 L 68 60 C 68 70, 52 70, 52 60 Z" stroke="#F9FAFB" stroke-width="5" fill="none"/>
  </g>
</svg>"""

with open("assets/brand/honeychain_app_icon.svg", "w", encoding="utf-8") as f:
    f.write(app_icon_svg)

print("All icon and favicon assets generated successfully!")
