const Project = require('./component/project.js');

const { resolve } = require('path');


let config = {
	caching: true,
	output: "out",
	source: false,
	execute: false
};

function Compile(root) {
	// Load required files
	let project = new Project(root, {
		caching: config.caching
	});
	project.import(root, true);

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
}




let tests = [
	"example.cpp"
].map( x => {
	return resolve("./test", x);
});

let i = 0;
for (let file of tests) {
	console.log("\nTest", i++, ' of ', tests.length);
	Compile(file);
}