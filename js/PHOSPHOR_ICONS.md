# 📦 `js/phosphor-full.css` — Phosphor Icon Build Source

## Was ist diese Datei?

`phosphor-full.css` ist eine **vollständige Kopie der Phosphor Icons Regular CSS-Definitionen** aus dem offiziellen `@phosphor-icons/web@2.1.2` Paket. Sie enthält alle **1530 Icon-Klassen** (`ph-cube`, `ph-timer`, etc.) mit ihren Unicode-Codepoints.

> [!IMPORTANT]
> Diese Datei ist **ausschließlich eine Build-Zeit-Quelle**. Sie wird **niemals** in `www/` deployed oder vom Browser geladen. Nur die wenigen tatsächlich verwendeten Icons landen nach dem Build in `www/style.css`.

## Warum existiert sie hier?

Das Projekt verwendet einen **selbst-gehosteten Phosphor Icon Font** (`www/fonts/Phosphor.woff2`) ohne externe CDN-Abhängigkeiten (GDPR-Compliance). Um trotzdem flexibel beliebige Icons nutzen zu können, ohne manuell Unicode-Codepoints nachschlagen und eintragen zu müssen, dient diese Datei als **Lookup-Tabelle für den Build-Prozess**.

### Das Problem ohne diese Datei

Früher (bis diese Datei von einem Agenten fälschlicherweise als "ungenutzt" gelöscht wurde) musste jedes neue Icon manuell in `style.src.css` eingetragen werden — Name und korrekter Unicode-Codepoint. Das ist fehleranfällig, mühsam und wurde oft vergessen, was dazu führte, dass Icons wie `ph-cube` unsichtbar blieben.

## Wie funktioniert der Workflow?

Das Build-Script [`js/compile-icons.js`](./compile-icons.js) übernimmt alles automatisch:

```
npm run build
   │
   ├─ 1. compile-icons.js
   │     ├── Scannt: www/index.html, www/impressum.html,
   │     │           www/datenschutz.html, script.src.js
   │     ├── Findet: alle ph-* Klassen (z.B. ph-cube, ph-timer)
   │     ├── Lookup: phosphor-full.css (diese Datei)
   │     └── Schreibt: Icon-Regeln in style.src.css (AUTO-ICONS Block)
   │
   ├─ 2. tailwindcss → kompiliert style.src.css → www/style.css
   ├─ 3. compile-js.js → minifiziert script.src.js → www/script.js
   └─ 4. version-sw.js → bumpt Service Worker Cache-Version
```

## Ein neues Icon hinzufügen — so geht's

1. Das gewünschte Icon in einer beliebigen Quelldatei verwenden:
   ```html
   <i class="ph ph-cube"></i>
   ```
2. Build ausführen:
   ```bash
   npm run build
   ```
3. Fertig — `compile-icons.js` findet die neue Klasse automatisch und injiziert die CSS-Regel.

**Kein manuelles Nachschlagen von Unicode-Codepoints. Kein manuelles Editieren von `style.src.css`.**

## Wie wird `style.src.css` aktualisiert?

Das Script pflegt einen klar markierten Block in `style.src.css`:

```css
/* AUTO-ICONS:START */
/* Auto-generated — do not edit manually. Run: npm run build */
.ph-cube:before { content: "\e1c6"; }
.ph-timer:before { content: "\e492"; }
/* ... weitere verwendete Icons ... */
/* AUTO-ICONS:END */
```

> [!WARNING]
> Den `AUTO-ICONS:START` / `AUTO-ICONS:END` Block in `style.src.css` **nicht manuell bearbeiten**. Er wird bei jedem `npm run build` vollständig überschrieben.
>
> Die `.ph { font-family: "Phosphor" ... }` **Basisklasse** steht **unterhalb** des AUTO-ICONS Blocks und wird **nicht** vom Script berührt — sie muss dort manuell verbleiben.

## Herkunft & Aktualisierung

Die Datei wurde aus dem offiziellen Phosphor-Paket extrahiert (war zuvor unter `www/fonts/phosphor.css` committed, wurde dann gelöscht und via Git-History wiederhergestellt):

```bash
# Ursprung (nur zur Info — NICHT erneut ausführen, es sei denn das Paket muss aktualisiert werden):
git show 0573f84:www/fonts/phosphor.css > js/phosphor-full.css
```

Sollte das Phosphor-Paket auf eine neue Major-Version updaten, muss diese Datei ebenfalls aktualisiert werden. In dem Fall die neue CSS-Datei aus dem Paket holen und hier ersetzen — das Build-Script passt sich automatisch an.

**Aktuelle Paket-Version: `@phosphor-icons/web@2.1.2`**
