# Variables
ASSETS_DIR := assets
CONFIG_FILE := $(ASSETS_DIR)/config.json

# ANSI Colors
GREEN := \033[0;32m
NC := \033[0m


.PHONY: all help clean test-all create-assets-dir

# Help documentation
help:
	@echo "Available targets:"
	@echo "  config-valid      - Create config with valid port"
	@echo "  config-invalid    - Create config with invalid port"
	@echo "  config-missing    - Create config without port"
	@echo "  config-malformed  - Create malformed JSON"
	@echo "  clean            - Remove config file"
	@echo "  test-all         - Test all configurations"

# Create assets directory
create-assets-dir:
	@mkdir -p $(ASSETS_DIR)

# Valid configuration
config-valid: create-assets-dir
	@echo '{"port": 8080}' > $(CONFIG_FILE)
	@echo "$(GREEN)Created valid config with port 8080$(NC)"

# Invalid port configuration
config-invalid: create-assets-dir
	@echo '{"port": -1}' > $(CONFIG_FILE)
	@echo "$(GREEN)Created config with invalid port$(NC)"

# Missing port configuration
config-missing: create-assets-dir
	@echo '{}' > $(CONFIG_FILE)
	@echo "$(GREEN)Created config without port$(NC)"

# Malformed JSON configuration
config-malformed: create-assets-dir
	@echo '{port: 8080' > $(CONFIG_FILE)
	@echo "$(GREEN)Created malformed JSON config$(NC)"

# Empty file configuration
config-empty: create-assets-dir
	@echo '' > $(CONFIG_FILE)
	@echo "$(GREEN)Created empty config file$(NC)"

# Test all configurations
test-all: config-valid config-invalid config-missing config-malformed config-empty

# Clean generated files
clean:
	@rm -f $(CONFIG_FILE)
	@echo "$(GREEN)Cleaned up config files$(NC)"