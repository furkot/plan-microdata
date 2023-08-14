PROJECT=plan-microdata
GLOBALVAR=furkotPlanMicrodata
BUILD_DIR=build
SCRIPT_NAME=$(BUILD_DIR)/furkot-$(PROJECT)

BIN=./node_modules/.bin
SRC = $(wildcard lib/*.js)

ESBUILD_OPTS += \
	--bundle \
	--log-level=warning \
	--color=false \
	--tree-shaking=true \
	--global-name=$(GLOBALVAR)
	--target=es2020

ESBUILD_MIN_OPTS += \
	--define:DEBUG=false \
	--drop:console \
	--drop:debugger \
	--minify

define RUN_ESBUILD
	$(BIN)/esbuild $< \
		$(ESBUILD_OPTS) \
		--sourcemap=linked \
		--outfile=$@
endef

define RUN_ESBUILD_MIN
	$(BIN)/esbuild $< \
		$(ESBUILD_OPTS) \
		$(ESBUILD_MIN_OPTS) \
		--sourcemap=external \
		--sources-content=false \
		--outfile=$@
endef

%.gz: %
	gzip --best --stdout $< > $@

all: check compile

check: lint

lint: node_modules
	$(BIN)/jshint lib

compile: $(SCRIPT_NAME).js

build:
	mkdir -p $@

$(SCRIPT_NAME).js: lib/index.js $(SRC) node_modules | $(BUILD_DIR)
	$(RUN_ESBUILD)

$(SCRIPT_NAME).min.js: lib/index.js $(SRC) node_modules | $(BUILD_DIR)
	$(RUN_ESBUILD_MIN)

node_modules: package.json
	yarn
	touch $@

clean:
	rm -rf $(BUILD_DIR)

distclean: clean
	rm -rf node_modules

.PRECIOUS: $(SCRIPT_NAME).min.js

dist: $(SCRIPT_NAME).min.js.gz

.PHONY: all lint test compile dist clean distclean
