const { Generator_ID } = require('./generate.js');

const Flattern = require('./../parser/flattern.js');
const TypeDef = require('./typedef.js');
const LLVM = require('../middle/llvm.js');
const Execution = require('./execution.js');
const Scope = require('./memory/scope.js');
const State = require('./state.js');
const TypeRef = require('./typeRef.js');


let funcIDGen = new Generator_ID();

class Function_Instance {
	constructor (ctx, ast, external = false, abstract = false) {
		this.ctx = ctx;
		this.ast = ast;
		this.ref = ast.ref.start;
		this.external = external;
		this.abstract = abstract;

		this.returnType = null;
		this.signature = [];
		this.calls = new Map();
		this.isInline = false;

		this.linked = false;

		this.id = funcIDGen.next();

		this.name = ast.tokens[0].tokens[1].tokens;
		this.represent = external ? `${this.name}` : `${this.name}.${this.ctx.getFileID().toString(36)}.${this.id.toString(36)}`;
	}

	markExport() {
		this.represent = this.name;
	}

	getFileID() {
		return this.ctx.getFileID();
	}

	getFile() {
		return this.ctx.getFile();
	}

	getFunctionGroup() {
		return this.ctx.getFunctionGroup();
	}
	getFunctionInstance() {
		return this;
	}

	/**
	 * Marks this function as being called from this function
	 * @param {Function_Instance} func
	 * @param {State} state
	 * @returns {Boolean} whether this was a new call or not
	 */
	addCall(func, state = new State()) {
		let states = this.calls.get(func) || [];

		let found = false;
		for (let prev of states) {
			if (prev.match(state)) {
				found = true;
				break;
			}
		}

		if (!found) {
			states.push(state);
			this.calls.set(func, states);

			return true;
		}

		return false;
	}



	link () {
		if (this.linked) {
			return;
		}

		let file = this.getFile();
		let head = this.ast.tokens[0];
		let args = head.tokens[2].tokens;

		// Flaten signature types AST into a single array
		let types = [ head.tokens[0] ];
		if (args.length > 0) {
			types = types.concat(args.map((x) => {
				return x[0];
			}));
		}

		// Generate an execution instance for type resolving
		let exec = new Execution(
			this,
			null,
			new Scope(this, this.getFile().project.config.caching)
		);

		for (let type of types){
			let search = exec.resolveType(type);
			if (search instanceof TypeRef) {
				search.pointer = type.tokens[0]; // Copy the pointer level across
				this.signature.push(search);
			} else {
				file.throw(
					`Invalid type name "${Flattern.DataTypeStr(type)}"`,
					type.ref.start, type.ref.end
				);
			}
		}

		this.returnType = this.signature.splice(0, 1)[0];
		this.linked = true;
	}



	match (other) {
		// Ensure both functions have linked their data types
		this.link();
		other.link();

		// Match the signatures
		return this.matchSignature(other);
	}
	matchSignature (sig) {
		this.link();

		if (this.signature.length != sig.length) {
			return false;
		}

		for (let i=0; i<sig.length; i++) {
			if (!this.signature[i].match(sig[i])) {
				return false;
			}
		}

		return true;
	}



	compile() {
		if (this.abstract) {
			return null;
		}

		let scope = new Scope(
			this,
			this.getFile().project.config.caching
		);

		let head = this.ast.tokens[0];
		let args = [];
		for (let i=0; i<this.signature.length; i++) {
			args.push({
				type: this.signature[i],                     // TypeRef
				name: head.tokens[2].tokens[i][1].tokens,    // Name
				ref: head.tokens[2].tokens[i][0].ref.start  // Ref
			});
		}

		let res = scope.register_Args( args );
		if (res == null) {
			return null;
		}

		let frag = new LLVM.Procedure(
			this.returnType.toLLVM(head.tokens[0].ref),
			new LLVM.Name(this.represent, true, head.tokens[1].ref),
			res.registers.map( x => x.toLLVM() ),
			"#1",
			this.external,
			this.ref
		);

		if (!this.abstract && !this.external) {
			// Mark the entry point
			let entry_id = new LLVM.ID();
			let entry = new LLVM.Label( entry_id, this.ast.ref.start );
			frag.append( entry.toDefinition(true) );

			// Apply the argument reads
			frag.merge(res.frag);

			// Compile the internal behaviour
			let exec = new Execution(
				this,
				this.returnType,
				scope,
				entry_id.reference()
			);
			frag.merge(exec.compile(this.ast.tokens[1]));
		}

		let gen = new Generator_ID(0);
		frag.assign_ID(gen);
		frag.flattern();

		return frag;
	}
}

module.exports = Function_Instance;