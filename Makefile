.PHONY: help install dev build start deploy logs clean

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo '$(BLUE)Arena Mock Server - Available Commands:$(NC)'
	@echo ''
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ''

install: ## Install dependencies
	@echo '$(BLUE)Installing dependencies...$(NC)'
	yarn install

dev: ## Start development server
	@echo '$(BLUE)Starting development server on http://localhost:8080$(NC)'
	yarn dev

build: ## Build for production
	@echo '$(BLUE)Building production bundle...$(NC)'
	yarn build

start: build ## Start production server
	@echo '$(BLUE)Starting production server...$(NC)'
	yarn start

deploy: ## Deploy to Vercel
	@echo '$(BLUE)Deploying to Vercel...$(NC)'
	vercel --prod

deploy-preview: ## Deploy preview to Vercel
	@echo '$(BLUE)Deploying preview to Vercel...$(NC)'
	vercel

logs: ## View Vercel deployment logs
	@echo '$(BLUE)Fetching Vercel logs...$(NC)'
	vercel logs

test-health: ## Test health endpoint (requires running server)
	@echo '$(BLUE)Testing health endpoint...$(NC)'
	@curl -s http://localhost:8080/api/v1/health | jq '.'

test-session: ## Test session creation (requires running server)
	@echo '$(BLUE)Testing session creation...$(NC)'
	@curl -s -X POST http://localhost:8080/api/v1/session -c cookies.txt | jq '.'

test-all: test-health test-session ## Run all API tests
	@echo '$(GREEN)All tests completed!$(NC)'

clean: ## Clean build artifacts and dependencies
	@echo '$(YELLOW)Cleaning build artifacts...$(NC)'
	rm -rf .next node_modules .vercel cookies.txt

type-check: ## Run TypeScript type checking
	@echo '$(BLUE)Running TypeScript type check...$(NC)'
	yarn type-check

.DEFAULT_GOAL := help

