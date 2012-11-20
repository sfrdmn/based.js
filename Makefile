.PHONY: test

test:
			nodeunit $(wildcard test/*.test.js)
