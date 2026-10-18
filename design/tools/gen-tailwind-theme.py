#!/usr/bin/env python3
"""Generate design/theme.tailwind.css for mywebsite-2 from the FigCraft variables,
cross-checked against the project's real Tailwind v4 theme (src/styles/index.css).

Rules (deliberate, see the header it writes into the file):
  * colours, font and shadows come from index.css, never from the design, so the
    file can't drift from what the app actually ships;
  * the three design-only colours (control-*) are marked as such;
  * Scale radii -> --radius-* (Tailwind v4 namespace, no clash with the defaults);
  * Scale sizes -> plain --size-* custom properties (v4 has no --size namespace);
  * Type -> --text-* and named Layout -> --spacing-*, mobile-first:
    base = Mobile, @media (min-width: 768px) = Tablet, (min-width: 1280px) = Desktop
    (768 / 1280 are Tailwind's own md / xl);
  * numeric space/NN tokens are skipped: the v4 default spacing scale already
    covers them at the same 4 px steps.
"""
import json, re, sys

from pathlib import Path

REPO = Path(__file__).resolve().parents[2]          # design/tools/x.py -> repo root
CSS = REPO / "src/styles/index.css"
VARS = REPO / "design/tokens/from-design.json"
OUT = REPO / "design/tokens/theme.tailwind.css"


def parse_css(path):
    src = Path(path).read_text()

    def block(pattern):
        m = re.search(pattern, src, re.M)
        j = src.index("{", m.end() - 1)
        depth, k = 0, j
        while k < len(src):
            depth += src[k] == "{"
            depth -= src[k] == "}"
            if depth == 0:
                break
            k += 1
        return src[j + 1:k]

    def grab(sel):
        out = {}
        for name, val in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", block(sel)):
            out[name] = val.strip()
        return out

    return grab(r"^@theme\s*\{"), grab(r"^\.dark\s*\{")


def load(path):
    m = json.loads(Path(path).read_text())["meta"]
    colls = {cid: c for cid, c in m["variableCollections"].items()}
    out = []
    for v in m["variables"].values():
        c = colls[v["variableCollectionId"]]
        modes = [mm["name"] for mm in c["modes"]]
        vals = dict(zip(modes, v["valuesByMode"].values()))
        out.append(dict(name=v["name"], type=v["resolvedType"],
                        collection=c["name"], values=vals))
    return out


def hexof(c):
    ch = lambda x: max(0, min(255, round(x * 255)))
    return "#%02x%02x%02x" % (ch(c["r"]), ch(c["g"]), ch(c["b"]))


def px(x):
    return f"{x:g}px"


def main():
    light, dark = parse_css(CSS)
    variables = load(VARS)
    by = {}
    for v in variables:
        by.setdefault(v["collection"], []).append(v)

    theme = sorted(by["Theme"], key=lambda v: v["name"])
    scale = sorted(by["Scale"], key=lambda v: v["name"])
    typ = sorted(by["Type"], key=lambda v: v["name"])
    lay = sorted(by["Layout"], key=lambda v: v["name"])

    # ---- colour sanity: everything that also exists in the CSS must match ----
    mismatches = []
    for v in theme:
        key = f"--color-{v['name']}"
        if key not in light:
            continue
        for mode, cssval in (("Light", light[key]), ("Dark", dark.get(key, light[key]))):
            if hexof(v["values"][mode]).lower() != cssval.lower():
                mismatches.append((v["name"], mode, hexof(v["values"][mode]), cssval))
    if mismatches:
        for m in mismatches:
            print("MISMATCH", m, file=sys.stderr)
        raise SystemExit("aborting: design colours disagree with index.css")

    css_only = [k for k in theme if f"--color-{k['name']}" not in light]
    L = []
    A = L.append
    A("/* design/theme.tailwind.css — generated from design/theme-variables.json")
    A(" * and cross-checked against src/styles/index.css (Tailwind v4.3.1, the")
    A(" * version installed in this project). Do not hand-edit: regenerate.")
    A(" *")
    A(" * Wiring: this file is a token partial. Either paste its blocks into")
    A(" * src/styles/index.css (replacing the current @theme / .dark) or import it")
    A(" * right after `@import 'tailwindcss';`.")
    A(" *")
    A(" * Values: colours, font and shadows are copied verbatim from index.css, so")
    A(" * importing this file changes nothing visually — it only adds utilities")
    A(" * (radius-*, text-*, and the named padding/gap sizes) that did not exist")
    A(" *")
    A(" * Scale sizes (--size-*) are plain custom properties on purpose: Tailwind v4")
    A(" * has no --size-* theme namespace, they are component sizes, not utilities.")
    A(" * Numeric space/NN tokens are skipped: the default --spacing scale already")
    A(" * gives the same 4px steps (p-4 = 16px = space/16).")
    if css_only:
        A(" *")
        A(" * Design-only colours (no counterpart in index.css, kept out of the real")
        A(f" * theme until decided): {', '.join(k['name'] for k in css_only)}.")
    A(" */")
    A("")
    A("@theme {")
    A("  /* ---- typography ------------------------------------------------------ */")
    A('  --font-sans: \'Inter\', sans-serif;')
    A("")
    A("  /* ---- colours: light (dark lives in .dark below) ---------------------- */")
    for v in theme:
        key = f"--color-{v['name']}"
        val = light.get(key) or hexof(v["values"]["Light"])
        note = "" if key in light else "  /* design-only */"
        A(f"  {key}: {val};{note}")
    A("")
    A("  /* ---- radius (Scale) -------------------------------------------------- */")
    for v in scale:
        short = v["name"].split("/", 1)[1]
        if v["name"].startswith("radius/"):
            A(f"  --radius-{short}: {px(v['values']['Value'])};")
    A("")
    A("  /* ---- type scale (Type, @theme value = mobile) ------------------------ */")
    for v in typ:
        A(f"  --text-{v['name'].split('/', 1)[1]}: {px(v['values']['Mobile'])};")
    A("")
    A("  /* ---- named layout spacing (Layout, @theme value = mobile) ------------ */")
    named = [v for v in lay if re.search(r"[a-z]", v["name"].split("/", 1)[1])]
    for v in named:
        A(f"  --spacing-{v['name'].split('/', 1)[1]}: {px(v['values']['Mobile'])};")
    A("")
    A("  /* ---- glow shadows (from index.css) ---------------------------------- */")
    for key in ("--shadow-glow-primary", "--shadow-glow-accent"):
        if key in light:
            A(f"  {key}: {light[key]};")
    A("}")
    A("")
    A("/* ---- dark mode (verbatim from the project's .dark block) ---------------- */")
    A(".dark {")
    A("  color-scheme: dark;")
    for key, val in dark.items():
        if key.startswith("--color-"):
            A(f"  {key}: {val};")
    A("")
    for key, val in dark.items():
        if key.startswith("--shadow-"):
            A(f"  {key}: {val};")
    A("}")
    A("")
    A("/* ---- component sizes (Scale; not a Tailwind namespace) ------------------- */")
    A(":root {")
    for v in scale:
        if v["name"].startswith("size/"):
            A(f"  --size-{v['name'].split('/', 1)[1]}: {px(v['values']['Value'])};")
    A("}")
    A("")

    def tier(title, mq, mode, items, prefix):
        A(f"/* ---- {title} -------------------------------------------------------- */")
        A(f"@media (min-width: {mq}px) {{")
        A("  :root {")
        for v in items:
            A(f"    {prefix}{v['name'].split('/', 1)[1]}: {px(v['values'][mode])};")
        A("  }")
        A("}")
        A("")

    tier("tablet: 768px and up (Tailwind md)", 768, "Tablet", typ, "--text-")
    tier("tablet spacing: 768px and up", 768, "Tablet", named, "--spacing-")
    tier("desktop: 1280px and up (Tailwind xl)", 1280, "Desktop", typ, "--text-")
    tier("desktop spacing: 1280px and up", 1280, "Desktop", named, "--spacing-")

    Path(OUT).write_text("\n".join(L).rstrip() + "\n")
    print(f"wrote {OUT.relative_to(REPO)}: {len(L)} lines")
    print(f"colours: {len(theme)} ({len(theme) - len(css_only)} from index.css, "
          f"{len(css_only)} design-only)")
    print(f"radius: {len([v for v in scale if v['name'].startswith('radius/')])}, "
          f"sizes: {len([v for v in scale if v['name'].startswith('size/')])}, "
          f"type: {len(typ)}, named spacing: {len(named)}")


if __name__ == "__main__":
    main()
