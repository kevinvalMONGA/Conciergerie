# Conciergerie — Statut du Projet

> Derniere mise a jour : 2026-03-08

## Description
Interface de gestion de conciergerie immobiliere

## Stack Technique
Next.js 16 + React 19 + TypeScript + Tailwind 4

## Infos Cles
| Cle | Valeur |
|-----|--------|
| Port(s) | 3000 |
| Base de donnees | Aucune |
| Fichiers source | 10 |
| Deploiement | Local uniquement |
| Scripts | `dev, build, start, lint` |
| Branche Git | `main` |
| Dernier commit | `c99bf14 chore: add LiteLLM proxy & Claude prompt caching rules to CLAUDE.md` |

## Modules / Fonctionnalites
Dashboard conciergerie, gestion de lots, import Excel

## Outils Integres
- **LiteLLM** : proxy LLM unifie (config: `~/tools/litellm/config.yaml`, port 4000)
- **Prompt Caching Claude** : `cache_control: {"type": "ephemeral"}` sur system prompts
- **Structured Outputs** : `output_config.format` (JSON) + `strict: true` (tools)
- **GitHub Actions** : PR auto-review + `@claude` mentions (`.github/workflows/claude.yml`)
- **Remote Control** : `/remote-control` pour continuer depuis mobile
- **Desktop App** : `/desktop` pour review visuelle des diffs

## Historique des Sessions
<!-- Claude met a jour cette section automatiquement a chaque session -->
| Date | Resume |
|------|--------|
| 2026-03-08 | Creation du PROJECT_STATUS.md — documentation initiale du projet |

## Prochaines Etapes
<!-- A mettre a jour a chaque session -->
- [ ] A definir selon les priorites

---
*Ce fichier est mis a jour automatiquement par Claude Code a chaque session de travail.*
