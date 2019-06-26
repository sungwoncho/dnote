DEP := $(shell command -v dep 2> /dev/null)
NPM := $(shell command -v npm 2> /dev/null)

## installation
install: install-go install-js
.PHONY: install

install-go:
ifndef DEP
	@echo "==> installing dep"
	@curl https://raw.githubusercontent.com/golang/dep/master/install.sh | sh
endif

	@echo "==> installing CLI dependencies"
	@dep ensure
.PHONY: install-cli

install-js:
ifndef NPM
	$(error npm is not installed)
endif

	@echo "==> installing web dependencies"
	@(cd ${GOPATH}/src/github.com/dnote/dnote/web && npm install --unsafe-perm)
.PHONY: install-js

## test
test-cli:
	@echo "==> running CLI test"
	@${GOPATH}/src/github.com/dnote/dnote/pkg/cli/scripts/test.sh
.PHONY: test-cli

test-api:
	@echo "==> running API test"
	@${GOPATH}/src/github.com/dnote/dnote/pkg/server/api/scripts/test-local.sh
.PHONY: test-api

test-web:
	@echo "==> running web test"
	@(cd ${GOPATH}/src/github.com/dnote/dnote/web && npm run test)
.PHONY: test-web

test: test-cli test-api test-web
.PHONY: test

## build
build-web:
	@echo "==> building web"
	@${GOPATH}/src/github.com/dnote/dnote/web/scripts/build-prod.sh
.PHONY: build-web