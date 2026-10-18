# Diseño — FigCraft

Los archivos de diseño de mywebsite-2 y los tokens que salen de ellos.
El código manda en los colores: `src/styles/index.css` (Tailwind v4, `@theme` + `.dark`).

## Estructura

```text
design/
  website-desktop.figcraft   Las 15 pestañas (7 páginas × light/dark + Components),
                             1440/768/390 lado a lado. 1,9 MB.
  design-system.figcraft     Librería publicada (library v3): Theme (19), Scale (13),
                             Type (30), Layout (52) = 114 variables. Sin servidor.
  tokens/
    from-css.json            index.css → variables de FigCraft (formato variable.import)
    from-design.json         variable.export de la librería (formato REST; el diffeable)
    variables.css            Las mismas variables como custom properties
                             (:root + [data-theme] / [data-type] / [data-layout])
    theme.tailwind.css       Bloque @theme de Tailwind v4 generado desde from-design.json
  tools/
    tokens-from-css.py       index.css → tokens/from-css.json
    gen-tailwind-theme.py    tokens/from-design.json + index.css → tokens/theme.tailwind.css
    check-tokens.py          Diff de colores diseño vs index.css (Light y Dark)
    verify-tailwind-theme.mjs Compila theme.tailwind.css con el tailwindcss instalado
                              y comprueba 18 asserts (utilidades, escalas, valores)
  exports/                   PNG renderizados (63). NO versionado, es regenerable.
```

## Regenerar

```sh
# 1. Código → FigCraft (si cambia el theme del CSS)
python3 design/tools/tokens-from-css.py
cat > /tmp/import-vars.jsonl <<'EOF'
{"command":"variable.import","params":{"variables":"design/tokens/from-css.json"}}
{"command":"file.save","params":{}}
EOF
figcraft-cli run /tmp/import-vars.jsonl --in design/design-system.figcraft

# 2. Diseño → JSON/CSS (tras tocar variables en FigCraft)
cat > /tmp/export-vars.jsonl <<'EOF'
{"command":"variable.export","params":{"path":"design/tokens/from-design.json","format":"json"}}
{"command":"variable.export","params":{"path":"design/tokens/variables.css","format":"css"}}
EOF
figcraft-cli run /tmp/export-vars.jsonl --in design/design-system.figcraft

# 3. Tokens → Tailwind y verificación
python3 design/tools/gen-tailwind-theme.py
node design/tools/verify-tailwind-theme.mjs      # espera: PASS, 0 failed
python3 design/tools/check-tokens.py             # espera: 0 salvo los 3 control-* (design-only)
```

`figcraft-cli run` no lee de stdin: el script va en un fichero (de ahí los `/tmp/*.jsonl`).

## Notas

- **`library.publish` no persiste hasta `file.save`.** Y el nombre de la librería es el del
  documento (`mywebsite-2 — Design System`), no el del fichero: `library.extendCollection`
  falla con *no enabled library X* si usas el nombre del fichero.
- Para consumirla desde otro archivo: `library.add {path: <ruta>}` →
  `library.extendCollection {library, collection}` → crea `Theme (extended)` etc. y sigue
  las actualizaciones (`library.updates` / `library.acceptUpdates`).
- `website-desktop.figcraft` **no** consume la librería: sus 2.219 capas siguen enlazadas a
  sus colecciones locales. Migrarlo son 7.189 campos re-enlazados; no se ha hecho.
- Los `.figcraft` son zip: git guarda una copia completa por cambio. Por eso `from-design.json`
  va versionado también — es lo que se puede diffear.
- `--no-system-fonts` en el CLI da renders idénticos en cualquier máquina.
