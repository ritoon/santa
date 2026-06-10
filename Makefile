# Makefile racine — orchestration des projets `api/` (Go) et `front/` (React/Vite).
#
# Le dossier `api/` est réalisé par les participants : ses cibles supposent un
# module Go classique (point d'entrée `./cmd/api` ou `.`). Adapte si besoin.

# ---- Variables -------------------------------------------------------------
FRONT_DIR      := front
API_DIR        := api
REGISTRY       ?= santa
TAG            ?= latest
FRONT_IMAGE    := $(REGISTRY)/front:$(TAG)
API_IMAGE      := $(REGISTRY)/api:$(TAG)
VITE_API_URL   ?= http://localhost:8080

.DEFAULT_GOAL := help

# ---- Aide ------------------------------------------------------------------
.PHONY: help
help: ## Affiche cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ---- Front -----------------------------------------------------------------
.PHONY: front-install
front-install: ## Installe les dépendances du front (pnpm)
	cd $(FRONT_DIR) && pnpm install

.PHONY: front-dev
front-dev: ## Lance le front en mode dev (http://localhost:5173)
	cd $(FRONT_DIR) && pnpm dev

.PHONY: front-build
front-build: ## Build de production du front (dossier front/dist)
	cd $(FRONT_DIR) && pnpm build

.PHONY: front-lint
front-lint: ## Vérifie les types TypeScript du front
	cd $(FRONT_DIR) && pnpm lint

# ---- API (Go) --------------------------------------------------------------
.PHONY: api-run
api-run: ## Lance l'API Go en local (http://localhost:8080)
	cd $(API_DIR) && go run ./...

.PHONY: api-build
api-build: ## Compile le binaire de l'API Go (api/bin/api)
	cd $(API_DIR) && go build -o bin/api ./...

# ---- Run local (les deux ensemble) -----------------------------------------
.PHONY: run
run: ## Lance API + front en local via docker compose
	VITE_API_URL=$(VITE_API_URL) docker compose up --build

# ---- Images Docker ---------------------------------------------------------
.PHONY: docker-build
docker-build: docker-build-api docker-build-front ## Build les images Docker api + front

.PHONY: docker-build-front
docker-build-front: ## Build l'image Docker du front
	docker build \
		--build-arg VITE_API_URL=$(VITE_API_URL) \
		-t $(FRONT_IMAGE) $(FRONT_DIR)

.PHONY: docker-build-api
docker-build-api: ## Build l'image Docker de l'API
	docker build -t $(API_IMAGE) $(API_DIR)

# ---- Nettoyage -------------------------------------------------------------
.PHONY: clean
clean: ## Supprime les artefacts de build
	rm -rf $(FRONT_DIR)/dist $(FRONT_DIR)/node_modules $(API_DIR)/bin
