#include "print.cpp"
#include "alloc.cpp"

void PtrTest() {
	char* addr = malloc( 1 );
	int* b = static_cast<int*>(addr);
	*b = 2;

	return;
}

int main () {
	int a = 3;
	int b = 4;
	int c = a + b;

	println("Hello World");
	print(c);

	float d = static_cast<float>(c);
	print(d);

	return 0;
}