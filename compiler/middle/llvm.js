const Add = require('./add.js');
const Alloc = require('./alloc');
const And = require('./and.js');
const Argument = require('./argument.js');
const Bitcast = require('./bitcast.js');
const Branch = require('./branch.js');
const Branch_Unco = require('./branch_unco.js');
const Call = require('./call.js');
const Comment = require('./comment.js');
const Compare = require('./compare.js');
const Constant = require('./constant.js');
const Div = require('./div.js');
const Extend = require('./extend.js');
const FloatConvert = require('./floatconvert.js');
const Fragment = require('./fragment.js');
const GEP = require('./gep.js');
const ID = require('./id.js');
const Instruction = require('./instruction');
const Label = require('./label.js');
const Load = require('./load.js');
const Mul = require('./mul.js');
const Name = require('./name.js');
const Or = require('./or.js');
const Phi = require('./phi.js');
const Procedure = require('./procedure.js');
const Raw = require('./raw.js');
const Rem = require('./rem.js');
const Return = require('./return.js');
const Set = require('./set.js');
const Store = require('./store.js');
const Struct = require('./struct.js');
const Sub = require('./sub.js');
const Trunc = require('./trunc.js');
const Type = require('./type.js');
const WPad = require('./wpad');
const XOr = require('./xor.js');

module.exports = {
	Add, Alloc, And, Argument,
	Bitcast, Branch, Branch_Unco,
	Call, Comment, Compare, Constant,
	Div,
	Extend,
	FloatConvert,	Fragment,
	GEP,
	ID,
	Instruction,
	Label, Load,
	Mul,
	Name,
	Or,
	Phi, Procedure,
	Raw, Return,
	Rem,
	Set, Store, Struct, Sub,
	Trunc, Type,
	WPad,
	XOr
};
