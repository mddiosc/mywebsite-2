#!/usr/bin/env python3
"""Generate a FigCraft "local variables" JSON from the project's Tailwind theme.

Source of truth: src/styles/index.css (Tailwind v4 `@theme` block + `.dark` overrides).
Output: design/tokens/from-css.json — import it into a FigCraft file with
    figcraft-cli run  ->  {"command": "variable.import", "params": {"variables": "design/tokens/from-css.json"}}

The JSON matches what `variable.export` writes (collections with `modes[{modeId,name}]`,
variables with `resolvedType: COLOR|FLOAT` and `valuesByMode`), so export -> import round-trips:
collections join by name, values by mode name, anything new is added.

Usage:  python3 design/tools/tokens-from-css.py [--css src/styles/index.css] [--out design/tokens/from-css.json]
"""
import argparse
import json
import re
from pathlib import Path

# Tailwind v4 defaults the design uses but that are not in the project's CSS.
SPACING_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96, 112, 128, 160]
RADIUS_SCALE = {"xs": 2, "sm": 4, "md": 6, "lg": 8, "xl": 12, "2xl": 16, "3xl": 24, "4xl": 32, "full": 999}
TEXT_SCALE = {"xs": 12, "sm": 14, "base": 16, "lg": 18, "xl": 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72, "8xl": 96, "9xl": 128}
CSS_VAR_RE = re.compile(r"--([a-z0-9-]+)\s*:\s*([^;]+);")


def block(css: str, selector: str) -> dict:
    m = re.search(re.escape(selector) + r"\s*\{(.*?)\n\}", css, re.S)
    return dict(CSS_VAR_RE.findall(m.group(1))) if m else {}


def rgb(value: str):
    v = value.strip().lstrip("#")
    if len(v) == 3:
        v = "".join(c * 2 for c in v)
    if len(v) != 6:
        return None
    r, g, b = (int(v[i:i + 2], 16) / 255 for i in (0, 2, 4))
    return {"r": r, "g": g, "b": b, "a": 1.0}   # full precision: rounding here shifts bound colours by 1/255


def px(value: str):
    value = value.strip()
    if value.endswith("rem"):
        return round(float(value[:-3]) * 16, 4)
    if value.endswith("px"):
        return round(float(value[:-2]), 4)
    return None


class Builder:
    def __init__(self):
        self.collections = {}
        self.variables = {}
        self.n = 0

    def collection(self, key: str, name: str, modes: list[str]):
        cid = f"VariableCollectionId:{key}"
        self.collections[cid] = {"defaultModeId": f"{cid}/mode1", "hiddenFromPublishing": False,
                                 "id": cid, "key": cid,
                                 "modes": [{"modeId": f"{cid}/mode{i + 1}", "name": m} for i, m in enumerate(modes)],
                                 "name": name, "remote": False, "variableIds": []}
        return cid

    def variable(self, cid: str, name: str, values: dict, vtype="COLOR"):
        assert cid in self.collections, cid
        self.n += 1
        vid = f"VariableID:gen{self.n}"
        self.variables[vid] = {"codeSyntax": {}, "description": "", "hiddenFromPublishing": False,
                               "id": vid, "key": vid, "name": name, "remote": False,
                               "resolvedType": vtype, "scopes": ["ALL_SCOPES"],
                               "valuesByMode": values, "variableCollectionId": cid}
        self.collections[cid]["variableIds"].append(vid)

    def dump(self):
        return {"error": False, "status": 200,
                "meta": {"variableCollections": self.collections, "variables": self.variables}}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--css", default="src/styles/index.css")
    ap.add_argument("--out", default="design/tokens/from-css.json")
    args = ap.parse_args()

    css = Path(args.css).read_text()
    light, dark = block(css, "@theme"), block(css, ".dark")

    b = Builder()
    theme = b.collection("Theme", "Theme", ["Light", "Dark"])
    scale = b.collection("Scale", "Scale", ["Value"])
    typ = b.collection("Type", "Type", ["Desktop", "Tablet", "Mobile"])
    type_modes = list(b.collections[typ]["modes"])

    # 1. colours, straight from the CSS custom properties
    for key, val in light.items():
        if not key.startswith("color-"):
            continue
        name = key.replace("color-", "", 1)
        values = {"VariableCollectionId:Theme/mode1": rgb(val),
                  "VariableCollectionId:Theme/mode2": rgb(dark.get(key, val))}
        if all(v for v in values.values()):
            b.variable(theme, name, values)

    # 2. radii: the Tailwind scale plus the project's own --border-radius-* vars
    for label, v in RADIUS_SCALE.items():
        b.variable(scale, f"radius/{label}", {"VariableCollectionId:Scale/mode1": float(v)}, "FLOAT")
    for label, var in {"xl": "border-radius-xl", "2xl": "border-radius-2xl"}.items():
        if var in light and (v := px(light[var])):
            b.variable(scale, f"radius/{label}-css", {"VariableCollectionId:Scale/mode1": v}, "FLOAT")

    # 3. spacing steps (Tailwind v4: --spacing * n, i.e. 4 px per step) and the text scale
    for step in SPACING_STEPS:
        b.variable(scale, f"space/{step}", {"VariableCollectionId:Scale/mode1": float(step * 4)}, "FLOAT")
    for label, v in TEXT_SCALE.items():
        b.variable(typ, f"font/{label}", {m["modeId"]: float(v) for m in type_modes}, "FLOAT")

    Path(args.out).write_text(json.dumps(b.dump(), indent=1))
    colors = sum(1 for v in b.variables.values() if v["resolvedType"] == "COLOR")
    print(f"{args.out}: {len(b.collections)} collections, {len(b.variables)} variables "
          f"({colors} color, {len(b.variables) - colors} number)")


if __name__ == "__main__":
    main()
