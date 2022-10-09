.PHONY: all
all: install-deps dev

.PHONY: install-deps
install-deps: 
	ni

.PHONY: update
update:
	pnpm update
	cd src-tauri && cargo update

.PHONY: build
build:
	nr tauri build

.PHONY: dev
dev:
	nr tauri dev

PHONY: e2e-test
e2e-test:
	nr test

PHONY: test
test:
	cd src-tauri && cargo test

PHONY: help
help:
	nr tauri help
