.PHONY: build test clean optimize

build:
	stellar contract build

test:
	cargo test

clean:
	cargo clean

optimize:
	stellar contract optimize --wasm target/wasm32-unknown-unknown/release/vanta_key_contracts.wasm
