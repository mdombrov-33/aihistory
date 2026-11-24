# Root shortcuts for the existing frontend tools. Run `make` to list commands.
.DEFAULT_GOAL := help

# Build and typecheck share Next.js generated files; keep Make targets sequential.
.NOTPARALLEL:

ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
FRONTEND_DIR := $(ROOT_DIR)frontend
PNPM ?= pnpm
NODE ?= node

.PHONY: help install dev build start format format-check lint typecheck check \
        docs-check test test-browser test-list browsers catalog build-check verify clean

help: ## Show available commands
	@awk 'BEGIN { FS = ":.*## "; printf "Commands (run from the repository root):\n\n" } /^[a-zA-Z][a-zA-Z0-9_-]*:.*## / { printf "  make %-15s %s\n", $$1, $$2 }' "$(ROOT_DIR)Makefile"

install: ## Restore dependencies from the lockfile
	bash "$(ROOT_DIR)scripts/bootstrap-frontend.sh"

dev: ## Start the development server on localhost:3000
	$(PNPM) --dir "$(FRONTEND_DIR)" dev

build: ## Create the production build
	$(PNPM) --dir "$(FRONTEND_DIR)" build

start: ## Serve the existing production build (run make build first)
	$(PNPM) --dir "$(FRONTEND_DIR)" start

format: ## Format code and add readable blank lines
	$(PNPM) --dir "$(FRONTEND_DIR)" format

format-check: ## Check formatting and blank lines without changing files
	$(PNPM) --dir "$(FRONTEND_DIR)" format:check

lint: ## Run type-aware linting
	$(PNPM) --dir "$(FRONTEND_DIR)" lint

typecheck: ## Run TypeScript checks
	$(PNPM) --dir "$(FRONTEND_DIR)" typecheck

check: ## Check catalog, formatting, lint, types and documentation
	$(PNPM) --dir "$(FRONTEND_DIR)" check
	$(NODE) "$(ROOT_DIR)scripts/check-docs.mjs"

docs-check: ## Validate documentation links, headings and navigation
	$(NODE) "$(ROOT_DIR)scripts/check-docs.mjs"

test: ## Run browser-independent content, model and guest-state tests
	$(PNPM) --dir "$(FRONTEND_DIR)" test:scenes

test-browser: build ## Build and run desktop/mobile browser journeys
	$(PNPM) --dir "$(FRONTEND_DIR)" test:browser

test-list: ## List browser tests without executing them
	$(PNPM) --dir "$(FRONTEND_DIR)" exec playwright test --list

browsers: ## Install the matching Playwright Chromium browser
	$(PNPM) --dir "$(FRONTEND_DIR)" exec playwright install chromium

catalog: ## Regenerate discovery metadata from canonical lesson bundles
	$(NODE) "$(FRONTEND_DIR)/scripts/sync-prepared-catalog.mjs"

build-check: build ## Build and validate generated HTML, media and links
	$(NODE) "$(FRONTEND_DIR)/scripts/check-frontend-build.mjs"

verify: check test build-check ## Run all checks that do not need a browser

clean: ## Remove generated build, compiler and test output only
	rm -rf "$(FRONTEND_DIR)/.next" "$(FRONTEND_DIR)/tsconfig.tsbuildinfo" \
		"$(FRONTEND_DIR)/test-results" "$(FRONTEND_DIR)/playwright-report" \
		"$(FRONTEND_DIR)/blob-report" "$(FRONTEND_DIR)/coverage"
