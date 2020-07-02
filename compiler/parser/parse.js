const BNF = require('bnf-parser');
const fs = require('fs');

const syntax = BNF.types.BNF_Tree.fromJSON(
	JSON.parse(fs.readFileSync(__dirname+"/qupa.json", 'utf8'))
);


function Simplify_Program(node) {
	let out = [];
	for (let inner of node.tokens[1]) {
		out.push(Simplify_Stmt_Top(inner.tokens[0][0]));
	}
	node.tokens = out;

	// Remove irrelevant internal data
	node.reached = null;
	return node;
}

function Simplify_Stmt_Top(node) {
	let inner;
	switch (node.tokens[0].type) {
		case "comment":
			inner = node.tokens[0];
			break;
		case "external":
			inner = Simplify_External(node.tokens[0]);
			break;
		case "function":
			inner = Simplify_Function(node.tokens[0]);
			break;
		case "library":
			inner = Simplify_Library(node.tokens[0]);
			break;
		case "class":
			inner = Simplify_Class(node.tokens[0]);
			break;
		case "template":
			inner = Simplify_Template(node.tokens[0]);
			break;
		case "flag_definition":
			inner = Simplify_Flag_Definition(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected top level statement ${node.tokens[0].type}`);
	}

	// Remove irrelevant internal data
	inner.reached = null;
	return inner;
}



function Simplify_Library(node) {
	switch (node.tokens[0].type) {
		case "import":
			node.tokens = Simplify_Library_Import(node.tokens[0]);
			break;
		case "expose":
			node.tokens = Simplify_Library_Expose(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected library statement ${node.tokens[0].type}`);
	}
	node.reached = null;
	return node;
}
function Simplify_Library_Import (node) {
	let out = [null, null];
	switch (node.tokens[0].type) {
		case "import_direct":
			out[1] = Simplify_Name(node.tokens[0].tokens[6][0]);
		case "import_as":
			out[0] = Simplify_String(node.tokens[0].tokens[2][0]);
			break;
		default:
			throw new TypeError(`Unexpected library statement ${node.tokens[0].type}`);
	}

	node.tokens = out;
	node.reached = null;
	return node;
}
function Simplify_Library_Expose (node) {
	let match = "";
	if (typeof(node.tokens[2][0].tokens) == "string") {
		match = "*";
	} else {
		match = Simplify_Name(node.tokens[2][0].tokens[0]).tokens;
	}

	node.tokens = match;
	node.reached = null;
	return node;
}



function Simplify_String (node) {
	let data = "";
	for (let seg of node.tokens[0].tokens[1]) {
		if (typeof(seg.tokens) == "string") {
			data += seg.tokens;
		} else {
			data += seg.tokens[0].tokens;
		}
	}

	node.tokens = [
		node.tokens[0].tokens[0][0].tokens[0],
		data
	];
	node.reached = null;
	return node;
}



function Simplify_Class(node) {
	// TODO
	return node;
}



function Simplify_Template(node) {
	// TODO
	return node;
}



function Simplify_Flag_Definition(node) {
	// TODO
	return node;
}



function Simplify_External(node) {
	node.tokens = [
		node.tokens[2][0].tokens,                        // mode
		Simplify_External_Body(node.tokens[6][0]).tokens // internal
	];
	node.reached = null;
	return node;
}
function Simplify_External_Body(node) {
	let out = [];
	for (let inner of node.tokens[0]) {
		let next = Simplify_External_Term(inner.tokens[0][0]);
		if (next) {
			out.push(next);
		}
	}
	
	node.tokens = out;
	node.reached = null;
	return node;
}
function Simplify_External_Term(node) {
	let inner = null;
	switch (node.tokens[0].type) {
		case "function_outline":
			inner = Simplify_Function_Outline(node.tokens[0]);
			break;
		case "structure":
			inner = Simplify_Structure(node.tokens[0]);
			break;
		case "type_def":
			inner = Simplify_Type_Def(node.tokens[0]);
			break;
		case "declare":
			inner = Simplify_Declare(node.tokens[0]);
			break;
		case "comment":
			break;
		default:
			throw new TypeError(`Unexpected external statement ${node.tokens[0].type}`);
	}
	
	return inner;
}

function Simplify_Structure(node) {
	// TODO
	return node;
}

function Simplify_Type_Def(node) {
	node.tokens = [
		Simplify_Name(node.tokens[2][0]),   // name
		Simplify_Integer(node.tokens[6][0]) // size
	];
	node.reached = null;
	return node;
}



function Simplify_Name(node) {
	let out = node.tokens[0][0].tokens[0].tokens;
	for (let inner of node.tokens[1]) {
		if (Array.isArray(inner.tokens)) {
			if (inner.tokens[0].type == "letter") {
				out += inner.tokens[0].tokens[0].tokens;
			} else {
				out += inner.tokens[0].tokens;
			}
		} else {
			out += inner.tokens;
		}
	}

	node.tokens  = out;
	node.reached = null;
	return node;
}
function Simplify_Data_Type(node) {
	let inner;
	switch (node.tokens[0].type) {
		case "variable":
			inner = Simplify_Variable(node.tokens[0]);
			break;
		case "pointer":
			inner = Simplify_Pointer(node.tokens[0]);
			break;
		case "deref":
			inner = Simplify_Deref(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected data type ${node.tokens[0].type}`);
	}

	node.reached = null;
	node.tokens = [inner];
	return node;
}





function Simplify_Constant (node) {
	switch (node.tokens[0].type) {
		case "boolean":
			node.tokens = [ Simplify_Boolean(node.tokens[0]) ];
			break;
		case "integer":
			node.tokens = [ Simplify_Integer(node.tokens[0]) ];
			break;
		case "float":
			node.tokens = [ Simplify_Float(node.tokens[0]) ];
			break;
		default:
			throw new TypeError(`Unexpected constant expression ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Integer(node) {
	let out = "";
	if (node.tokens[0].length != 0) {
		out += "-";
	}

	node.tokens = ( node.tokens[0].length != 0 ? "-" : "" ) + ( Simplify_Integer_U( node.tokens[1][0] ).tokens );
	node.reached = null;
	return node;
}
function Simplify_Integer_U (node) {
	if (node.tokens[0].type == "zero") {
		node.tokens = "0";
	} else {
		let out = node.tokens[0].tokens[0][0].tokens;
		for (let val of node.tokens[0].tokens[1]) {
			out += val.tokens;
		};

		node.tokens = out;
	}

	node.reached = null;
	return node;
}
function Simplify_Float (node) {
	let out = Simplify_Integer(node.tokens[0][0]).tokens;  // base
	out += ".";
	out += Simplify_Integer_U(node.tokens[2][0]).tokens;   // remainder

	// Scientific notation
	if (node.tokens[3].length > 0) {
		out += "e";
		out += Simplify_Integer(node.tokens[3][0].tokens[1][0]).tokens;
	}

	node.tokens = out;
	node.reached = null;
	return node;
}
function Simplify_Boolean (node) {
	node.reached = null;
	return node;
}





function Simplify_Variable (node) {
	let out = [];
	out.push(Simplify_Name( node.tokens[0][0] )); // root

	for (let access of node.tokens[1]) {
		access = access.tokens[0];
		switch (access.type) {
			case "accessor_dynamic":
				out.push([ "[]", Simplify_Call_Args(access.tokens[2][0]) ]);
				break;
			case "accessor_static":
				out.push( [".", Simplify_Name(access.tokens[1][0])] );
				break;
			case "accessor_refer":
				out.push( ["->", Simplify_Name(access.tokens[1][0])] );
				break;
			default:
				throw new TypeError(`Unexpected accessor type ${access.type}`);
		}
	}

	node.tokens = out;
	node.reached = null;
	return node;
}

function Simplify_Pointer (node) {	
	node.tokens = [
		"@", Simplify_Variable(node.tokens[1][0])
	];
	node.reached = null;
	return node;
}

function Simplify_Deref (node) {
	node.tokens = [
		"$", Simplify_Variable(node.tokens[1][0])
	];
	node.reached = null;
	return node;
}


function Simplify_Function(node) {
	node.tokens = [
		Simplify_Function_Head(node.tokens[0][0]), // head
		Simplify_Function_Body(node.tokens[2][0])  // body
	];
	node.reached = null;
	return node;
}
function Simplify_Function_Outline(node) {
	node.tokens = [
		Simplify_Function_Head(node.tokens[0][0])  // head
	];
	node.reached = null;
	return node;
}
function Simplify_Function_Head (node) {
	node.tokens = [
		Simplify_Data_Type  (node.tokens[0][0]), // Return type
		Simplify_Name       (node.tokens[2][0]), // Name
		Simplify_Func_Args  (node.tokens[4][0]), // Arguments
		Simplify_Func_Flags (node.tokens[6][0])  // Flags
	];
	node.reached = null;
	return node;
}
function Simplify_Function_Body (node) {
	let out = [];
	for (let inner of node.tokens[2]) {
		out.push( Simplify_Function_Stmt(inner.tokens[0][0]).tokens[0] );
	}

	node.tokens  = out;
	node.reached = null;
	return node;
}
function Simplify_Function_Stmt (node) {
	let inner;
	switch (node.tokens[0].type) {
		case "comment":
			break;
		case "declare":
			inner = Simplify_Declare(node.tokens[0]);
			break;
		case "assign":
			inner = Simplify_Assign(node.tokens[0]);
			break;
		case "return":
			inner = Simplify_Return(node.tokens[0]);
			break;
		case "call_procedure":
			inner = Simplify_Call(node.tokens[0]);
			break;
		case "if":
		case "for":
		case "while":
		case "asm":
		default:
			throw new TypeError(`Unexpected function statement ${node.tokens[0].type}`);
	}
	
	node.tokens = [inner];
	node.reached = null;
	return node;
}
function Simplify_Func_Args (node) {
	node.tokens = node.tokens[2].length > 0 ? Simplify_Func_Args_List(node.tokens[2][0]).tokens : [];
	node.reached = null;
	return node;
}
function Simplify_Func_Args_List (node) {
	let ittr = node.tokens[0].concat(node.tokens[2].map(x => x.tokens[2][0]));

	node.tokens = ittr.map((arg) => {
		return [
			Simplify_Data_Type(arg.tokens[0][0]), // type
			Simplify_Name(arg.tokens[2][0]),      // name
			arg.tokens[3].length > 0 ? arg.tokens[3].tokens[3][0] : null // default
		]
	});

	node.reached = null;
	return node;
}
function Simplify_Func_Flags (node) {
	// TODO
	return node;
}
function Simplify_Call (node) {
	let out = [
		Simplify_Variable(node.tokens[0][0]),
		node.tokens[4].length > 0 ? Simplify_Call_Args(node.tokens[4][0]) : [],
	];

	node.tokens = out;
	node.reached = null;
	return node;
}
function Simplify_Call_Args (node) {
	node.tokens = [
		Simplify_Expr(node.tokens[0][0]) ]
			.concat( node.tokens[1].map(arg => {
				return Simplify_Expr(arg.tokens[3][0])
			}) )
	node.reached = null;
	return node;
}



function Simplify_Return (node) {
	let inner = [];
	if (node.tokens[1].length == 1) {
		inner = [ Simplify_Expr(node.tokens[1][0].tokens[1][0]) ];
	}

	node.tokens = inner;
	node.reached = null;
	return node;
}



function Simplify_Declare (node) {
	let out = [
		Simplify_Data_Type(node.tokens[0][0]),
		Simplify_Name(node.tokens[2][0])
	];

	node.tokens = out;
	node.reached = null;
	return node;
}



function Simplify_Assign  (node) {
	node.tokens = [
		Simplify_Variable (node.tokens[0][0]), // target variable
		Simplify_Expr     (node.tokens[4][0])  // value
	]
	node.reached = null;
	return node;
}



function Simplify_Expr (node) {
	return Simplify_Expr_p5 (node.tokens[0][0]);
}
function Simplify_Expr_p5 (node) {
	switch (node.tokens[0].type) {
		case "expr_p4":
			node = Simplify_Expr_p4(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p5 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Expr_p4 (node) {
	switch (node.tokens[0].type) {
		case "expr_p3":
			node = Simplify_Expr_p3(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p4 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Expr_p3 (node) {
	switch (node.tokens[0].type) {
		case "expr_p2":
			node = Simplify_Expr_p2(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p3 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Expr_p2 (node) {
	switch (node.tokens[0].type) {
		case "expr_p1":
			node = Simplify_Expr_p1(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p2 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Expr_p1 (node) {
	switch (node.tokens[0].type) {
		case "expr_opperand":
			node = Simplify_Expr_opperand(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p1 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
}
function Simplify_Expr_opperand (node) {
	switch (node.tokens[0].type) {
		case "call":
			node = Simplify_Call(node.tokens[0]);
			break;
		case "expr_brackets":
			node = Simplify_Expr_Brackets(node.tokens[0]);
			break;
		case "constant":
			node = Simplify_Constant(node.tokens[0]);
			break;
		case "variable":
			node = Simplify_Variable(node.tokens[0]);
			break;
		default:
			throw new TypeError(`Unexpected expr_p1 statement ${node.tokens[0].type}`);
	}

	node.reached = null;
	return node;
};
function Simplify_Expr_Brackets (node) {
	return Simplify_Expr ( node.tokens[2][0] );
}



function Parse (data, filename){
	// Parse the file and check for errors
	let result = BNF.Parse(data, syntax, "program");

	if (result.hasError || result.isPartial) {	
		let ref = result.tree.ref.reached.getReach();

		let msg = filename ? `${filename}: ` : "";
		msg += `Syntax error at ${ref.toString()}\n`;
		msg += `  ${BNF.Message.HighlightArea(data, ref).split('\n').join('\n  ')}\n\n`;
		msg += `  Interpreted: ${result.tree.reached.getCausation()}`;
		console.error(msg);
		process.exit(1);
	}

	return Simplify_Program(result.tree);
}

module.exports = Parse;