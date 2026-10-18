#!/usr/bin/env python3
"""Cross-check FigCraft local variables against the project's real Tailwind v4 tokens.

Source of truth = /Users/mddiosc/develop/mywebsite-2/src/styles/index.css
(@theme block + .dark block). FigCraft side = design/theme-variables.json
(REST-API shaped: meta.variableCollections / meta.variables + valuesByMode).
Nothing is generated here; this only reports.
"""
import json, re, sys

from pathlib import Path

REPO = str(Path(__file__).resolve().parents[2])
CSS = f"{REPO}/src/styles/index.css"
VARS = f"{REPO}/design/tokens/from-design.json"


def hexof(c):
    """FigCraft REST colour {r,g,b,a} floats 0..1 -> #RRGGBB (+alpha note)."""
    def ch(x):
        return max(0, min(255, round(x * 255)))
    a = c.get("a", 1.0)
    h = "#%02X%02X%02X" % (ch(c["r"]), ch(c["g"]), ch(c["b"]))
    return h, a


def parse_css(path):
    """Pull --name: value out of @theme {...} and .dark {...}."""
    src = open(path).read()

    def block(pattern):
        m = re.search(pattern, src, re.M)
        if not m:
            raise SystemExit(f"selector not found: {pattern}")
        j = src.index("{", m.end() - 1)
        depth, k = 0, j
        while k < len(src):
            if src[k] == "{":
                depth += 1
            elif src[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        return src[j + 1:k]

    light, dark = {}, {}
    for name, val in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", block(r"^@theme\s*\{")):
        light[name] = val.strip()
    for name, val in re.findall(r"(--[\w-]+)\s*:\s*([^;]+);", block(r"^\.dark\s*\{")):
        dark[name] = val.strip()
    return light, dark


def load_vars(path):
    m = json.load(open(path))["meta"]
    colls = {cid: c for cid, c in m["variableCollections"].items()}
    out = []
    for vid, v in m["variables"].items():
        coll = colls[v["variableCollectionId"]]
        modes = {mm["modeId"]: mm["name"] for mm in coll["modes"]}
        vals = {}
        for mid, val in v["valuesByMode"].items():
            vals[modes[mid]] = val
        out.append(
            dict(
                name=v["name"],
                type=v["resolvedType"],
                collection=coll["name"],
                values=vals,
            )
        )
    return out


def main():
    light, dark = parse_css(CSS)
    variables = load_vars(VARS)
    print(f"CSS  : {len(light)} tokens in @theme, {len(dark)} overrides in .dark")
    print(f"FigC : {len(variables)} variables")
    print()

    theme = [v for v in variables if v["collection"] == "Theme"]
    print("== Theme (COLOR) vs index.css ==")
    print(f"{'token':22} {'figcraft light':14} {'css light':10} "
          f"{'figcraft dark':14} {'css dark':10} verdict")
    bad = []
    for v in sorted(theme, key=lambda x: x["name"]):
        fl, fa = hexof(v["values"]["Light"])
        fd, fda = hexof(v["values"]["Dark"])
        cssname = f"--color-{v['name']}"
        cl = light.get(cssname)
        cd = dark.get(cssname, cl)  # .dark inherits @theme when it doesn't override
        ok_l = cl is not None and cl.upper() == fl
        ok_d = cd is not None and cd.upper() == fd
        verdict = "ok" if (ok_l and ok_d) else "MISMATCH"
        if not (ok_l and ok_d):
            bad.append((v["name"], cl, fl, cd, fd))
        print(f"{v['name']:22} {fl:14} {str(cl):10} {fd:14} {str(cd):10} {verdict}"
              + ("" if fa == 1.0 else f" (alpha {fa})")
              + ("" if fda == 1.0 else f" (dark alpha {fda})"))
    print()
    print("== tokens del CSS que FigCraft no tiene ==")
    fc_names = {"--color-" + v["name"] for v in theme}
    for name in light:
        if name.startswith("--color-") and name not in fc_names:
            print(f"  {name}: {light[name]}")
    print()
    print("== tokens de FigCraft sin equivalente CSS ==")
    for name in sorted(fc_names - set(light)):
        print(f"  {name}")
    print()
    print("== otros tokens CSS (no color) ==")
    for name, val in light.items():
        if not name.startswith("--color-"):
            print(f"  {name}: {val}   [in @theme]")
    for name, val in dark.items():
        if not name.startswith("--color-"):
            print(f"  {name}: {val}   [in .dark]")
    print()
    counts = {}
    for v in variables:
        counts.setdefault(v["collection"], 0)
        counts[v["collection"]] += 1
    print("== colecciones ==", counts)
    print()
    if bad:
        print(f"!! {len(bad)} discrepancias de color: {[b[0] for b in bad]}")
        return 1
    print(f"OK: las {len(theme)} variables de color de FigCraft coinciden con index.css en Light y Dark")
    return 0


if __name__ == "__main__":
    sys.exit(main())
