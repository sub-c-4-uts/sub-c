#include "print.cpp"

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