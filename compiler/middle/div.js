const Instruction = require("./instruction.js");
const LLVM = require('./llvm.js');

class Rem extends Instruction {
	/**
	 *
	 * @param {String} mode
	 * @param {LLVM.Type} type
	 * @param {LLVM.Name} opperand_a
	 * @param {LLVM.Name} opperand_b
	 * @param {BNF_Reference?} ref
	 */
	constructor(mode, type, opperand_a, opperand_b, ref) {
		super (ref);
		this.mode = mode;
		this.type = type;
		this.a = opperand_a;
		this.b = opperand_b;
	}

	flattern() {
		return super.flattern(
			( this.mode == 0 ? "u" : ( this.mode == 1 ? "s" : "f" ) ) +
			`div ` +
			`${this.type.flattern()} ` +
			`${this.a.flattern()}, ` +
			`${this.b.flattern()}`,
		0);
	}
}

module.exports = Rem;