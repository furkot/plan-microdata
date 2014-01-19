PROJECT=furkot-plan-microdata
BUILD_DIR=build

NODE_BIN=./node_modules/.bin
SRC = $(wildcard lib/*/*.js)

%.gz: %
	gzip --best --stdout $< > $@

%.min.js: %.js
	$(NODE_BIN)/uglifyjs $< --mangle --no-copyright --compress --wrap $(PROJECT) --output $@

all: lint build

$(BUILD_DIR)/$(PROJECT).js: components $(SRC)
	$(NODE_BIN)/component build --out $(BUILD_DIR) --use component-autoboot --name $(PROJECT)


build: $(BUILD_DIR)/$(PROJECT).js

lint:
	$(NODE_BIN)/jshint *.js lib test

test:
	$(NODE_BIN)/mocha --recursive --require should

components: component.json
	@component install --dev

clean:
	rm -rf $(BUILD_DIR)

.PRECIOUS: $(BUILD_DIR)/$(PROJECT).min.js

dist: $(BUILD_DIR)/$(PROJECT).min.js.gz

distclean: clean
distclean:
	rm -rf components

.PHONY: all lint test build dist clean distclean
