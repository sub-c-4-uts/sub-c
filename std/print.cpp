extern "C" {
	void i1_print(bool val);
	void i1_println(bool val);
	void i32_print(int val);
	void i32_println(int val);
	void i64_print(long val);
	void i64_println(long val);
	void f32_print(float val);
	void f32_println(float val);
	void str_print(char* val);
	void str_println(char* val);
}



/*------------------------------------
	Merge multi name C style functions
	 into single namespace
------------------------------------*/
void print(int val) {
	i32_print(val);
	return;
}
void print(long val) {
	i64_print(val);
	return;
}
void print(float val) {
	f32_print(val);
	return;
}
void print(bool val) {
	i1_print(val);
	return;
}
void print(char* val) {
	str_print(val);
	return;
}


void println(int val) {
	i32_println(val);
	return;
}
void println(long val) {
	i64_println(val);
	return;
}
void println(float val) {
	f32_println(val);
	return;
}
void println(bool val) {
	i1_println(val);
	return;
}
void println(char* val) {
	str_println(val);
	return;
}