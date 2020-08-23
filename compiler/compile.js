#!/usr/bin/env node
"use strict";

const Project = require('./component/project.js');

const path = require('path');
const os = require('os');
const fs = require('fs');
const { exec, spawn } = require('child_process');

const version = "Compiler v0.0.2";
const root = path.resolve("./");





/*------------------------------------------
	Compiler configuration flags
------------------------------------------*/
if (process.argv.includes("--version")) {
	console.info(version);
	process.exit(0);
}

let config = {
	caching: true,
	output: "out",
	source: false,
	execute: false
};
let index = process.argv.indexOf('-o');
if (index != -1 && index > 2) {
	config.output = process.argv[index+1] || "out";
}
if (process.argv.includes('--no-caching')) {
	config.caching = false;
}
if (process.argv.includes('--execute')) {
	config.execute = true;
}
index = process.argv.indexOf('-S');
if (index != -1) {
	config.source = process.argv[index+1] || "asm";
}





/*------------------------------------------
	Compilation to LLVM
------------------------------------------*/
// Load required files
let origin = path.resolve(root, process.argv[2]);
let project = new Project(root, {
	caching: config.caching
});
project.import(origin, true);

// Link elements
console.info("Linking...");
project.link();
if (project.error) {
	console.error("\nLinker error");
	process.exit(1);
}

// Compile to LLVM
console.info("Processing...");
let asm = project.compile();
if (project.error) {
	console.error("\nUncompilable errors");
	process.exit(1);
}

fs.writeFileSync(`${config.output}.ll`, asm.flattern(), 'utf8');




/*------------------------------------------
	Compilation in Clang
------------------------------------------*/
console.info("Compiling...");
if (config.execute && config.source !== false) {
	console.warn("Warn: Compilation flaged as executing result, but result is configured to output a non-executable");
	config.execute = false;
}

if (config.source != "llvm") {
	let runtime_path = path.resolve(__dirname, "./../runtime/runtime.ll");
	// let prebuilt_path = path.resolve(__dirname, "./../runtime/prebuilt.ll");
	let args = [
		"-x", "ir",
		runtime_path,
		"-x", "ir",
		`${config.output}.ll`
	];

	let exec_out = config.output;
	if (config.source == "asm") {
		args.push('-S');
		exec_out += ".s";
	} else if (os.platform() == "win32") {
		exec_out += ".exe";
	} else if (os.platform() == "darwin") {
		exec_out += ".app";
	} else {
		exec_out += ".out";
	}
	args = args.concat(["-o", exec_out]);

	let clang = spawn('clang++', args);
	clang.stderr.pipe (process.stderr);
	clang.stdout.pipe (process.stdout);


	if (config.execute) {
		clang.on('exit', ()=> {
			console.info('\nRunning...');
			let app = spawn(exec_out);
			app.stderr.pipe (process.stderr);
			app.stdout.pipe (process.stdout);
		});
	}
}