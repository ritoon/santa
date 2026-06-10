# 🎅 Santa — Listes au Père Noël

Mini-site permettant à des enfants de déposer leur liste de jouets pour le
Père Noël, puis de l'envoyer à leurs parents.

## Structure

```
.
├── api/      # API REST en Go (réalisée par les participants de la formation)
├── front/    # Site vitrine React + Vite + TypeScript + TailwindCSS (pnpm)
├── Makefile  # Build / run local + build des images Docker
└── docker-compose.yml
```

Le contrat REST attendu entre le front et l'API est décrit dans
[`front/API.md`](front/API.md).

## Front

SPA React qui propose : page d'accueil, inscription, connexion, catalogue de
jouets, détail d'un jouet, ajout à sa liste, détail de la liste, et envoi de la
liste à un parent. L'authentification utilise un JWT stocké côté navigateur.

## Démarrage rapide

```bash
make help            # liste toutes les cibles disponibles

# Front en local (http://localhost:5173)
make front-install
make front-dev

# API en local (http://localhost:8080) — une fois le dossier api/ implémenté
make api-run

# Tout via Docker (build + run)
make run
```

## Images Docker

```bash
make docker-build            # construit santa/api:latest et santa/front:latest
make docker-build-front      # front uniquement
```

> L'URL de l'API consommée par le front est injectée **au build** via
> `VITE_API_URL` (Vite inline la variable dans le bundle). Exemple :
> `make docker-build-front VITE_API_URL=https://api.exemple.com`.
