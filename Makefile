# Install dependencies for both backend and frontend
install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

# Start development environment
dev:
	./scripts/dev.sh

# Build production-ready images
build:
	docker build -t docmind-backend -f Dockerfile.backend .
	docker build -t docmind-frontend -f Dockerfile.frontend .

# Start all services using Docker Compose
docker-up:
	docker-compose up -d

# Stop all services using Docker Compose
docker-down:
	docker-compose down

# Clean up Docker resources
clean:
	docker-compose down --volumes --remove-orphans
	docker system prune -f
	docker volume prune -f

# Run tests for backend and frontend
test:
	pytest backend/tests
	cd frontend && npm test