function DataTypeList(node) {
	if (node.type == "constant") {
		return [ "lit", node.tokens[0].tokens ];
	}

	let out = [
		[ node.tokens[0], node.tokens[1].tokens ]
	];
	for (let access of node.tokens[2]){
		if (access.tokens[0] == "[]") {
			out.push([
				"[]",
				access.tokens[1].tokens.map( x => DataTypeList(x) )
			]);
		} else {
			out.push([access.tokens[0], access.tokens[1].tokens]);
		}
	}

	return out;
}

function DataTypeStr (node) {
	if (node.type == "constant") {
		return node.tokens[0].tokens;
	}

	let str = node.tokens[1].tokens + DuplicateChar(node.tokens[0], "*");
	if (node.tokens[2]) {
		for (let access of node.tokens[2]){
			if (access.tokens[0] == "[]") {
				str += `<${access.tokens[1].tokens.map( x => DataTypeStr(x) ).join(", ")}>`;
			} else {
				str += access.tokens[0] + access.tokens[1].tokens;
			}
		}
	}

	return str;
}



let VariableList = DataTypeList;
function VariableStr (node) {
	if (node.type == "constant") {
		return node.tokens[0].tokens;
	}

	let str = DuplicateChar(node.tokens[0], "*") + node.tokens[1].tokens;
	if (node.tokens[2]) {
		for (let access of node.tokens[2]){
			if (access.tokens[0] == "[]") {
				str += `[${access.tokens[1].tokens.map( x => DataTypeStr(x) ).join(", ")}]`;
			} else {
				str += access.tokens[0] + access.tokens[1].tokens;
			}
		}
	}

	return str;
}


/**
 *
 * @param {Number} count
 * @param {String} char
 */
function DuplicateChar(count = 1, char = "*"){
	let str = "";
	while (count > 0) {
		str += char;
		count--;
	}

	return str;
}


module.exports = {
	VariableList, VariableStr, DataTypeList, DataTypeStr, DuplicateChar
}