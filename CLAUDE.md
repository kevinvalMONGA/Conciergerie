# Conciergerie — Instructions Orchestrateur Principal

## Architecture
- **Framework** : Next.js 16 + React 19 + TypeScript + Tailwind 4
- **Port** : 3000
- **Pas de base de donnees** — UI statique / donnees locales
- **Pas d'auth** — interface publique

## Fonctionnalite principale
Interface de service de conciergerie / gestion immobiliere. Site vitrine.

## Structure
```
src/
├── app/              — App Router (page.tsx principal)
├── components/       — Composants React
├── data/             — Donnees statiques / contenu
└── types/            — Types TypeScript
```

## Conventions
- Code en anglais, UI en francais
- Server Components par defaut
- Tailwind pour le styling

## Workflow Git
1. `git pull` avant tout
2. `git add` uniquement les fichiers modifies (JAMAIS `git add .`)
3. `git commit` puis `git push`

---

## Pipeline pour toute modification de code

### Agents et skills disponibles

| Categorie | Agent/Skill | Usage |
|-----------|-------------|-------|
| **Analyse** | `feature-dev` | Guided feature development |
| **Design** | `frontend-design` | Interfaces production-grade |
| **Design** | `senior-frontend` | Expert React/Next.js/Tailwind |
| **Code** | `code-simplifier` | Simplifier le code |
| **Code** | `code-review` | Review guidelines |
| **Debug** | `debugger` | Diagnostic erreurs |
| **Git** | `commit-commands:commit-push-pr` | Commit + push + PR |
| **Build** | `build` | Build |
| **MCP** | `context7` | Docs Next.js |
| **MCP** | `ai-multi (ask_gemini)` | Second avis |
| **Images** | `nano-banana` | Generation images |

### Etapes
0. **Analyse** — `feature-dev`, comprendre le besoin
1. **Design** — `frontend-design` + `senior-frontend`
2. **Dev** — implementer
3. **Qualite** — `code-simplifier` + `code-review`
4. **Validation** — `build` sans erreur


## LiteLLM & Prompt Caching

### LiteLLM — Proxy LLM unifie
- **Config**: `~/tools/litellm/config.yaml`
- **Demarrage**: `litellm --config ~/tools/litellm/config.yaml --port 4000`
- **Modeles disponibles**: claude-opus, claude-sonnet, claude-haiku, gemini-flash, gemini-pro
- **Endpoint**: `http://localhost:4000/v1` (format OpenAI)
- **Master key**: `sk-litellm-monga-2026`
- Utiliser LiteLLM comme proxy quand le projet a besoin d appels LLM multi-providers ou de fallback automatique

### Prompt Caching Claude — Regles obligatoires
Quand on fait des appels API Claude (directement ou via LiteLLM):
- **Toujours** ajouter `cache_control: {"type": "ephemeral"}` sur le system prompt et le contexte stable
- Cache hits = **10x moins cher** que l input normal
- Minimum tokens pour cacher: 4096 (Opus/Haiku 4.5), 2048 (Sonnet)
- TTL par defaut: 5 min (rafraichi automatiquement). Option 1h avec `"ttl": "1h"` (2x prix)
- **Ordre dans le prompt**: tools → system (cache ici) → messages
- Ne PAS cacher le contenu qui change a chaque requete
- Verifier `cache_read_input_tokens` dans les reponses pour confirmer les hits


## PROJECT_STATUS.md — Mise a jour automatique
A CHAQUE debut et fin de session de travail sur ce projet:
1. Lire `PROJECT_STATUS.md` a la racine du projet
2. Mettre a jour la section "Historique des Sessions" avec la date et un resume concis du travail effectue
3. Mettre a jour "Prochaines Etapes" si pertinent
4. Mettre a jour "Dernier commit" et le nombre de fichiers si ca a change
5. Commit + push le fichier mis a jour avec le reste des changements

## .claude/RECAP.md — Suivi fait/pas fait
A CHAQUE session:
1. Lire `.claude/RECAP.md` pour savoir ou on en est (fait/pas fait)
2. Apres chaque tache terminee, cocher la case correspondante (- [x])
3. Ajouter de nouvelles taches si decouvertes en cours de session
4. Mettre a jour le pourcentage d avancement global
5. Inclure dans le commit+push
