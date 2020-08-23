#include "print.cpp"
#include "alloc.cpp"




struct Rect {
	int width;
	int height;
}

void Test_Structure() {
	// Define two example rectangles
	Rect a;
	Rect b;
	a.width = 4;
	a.height = 5;
	b.width = 6;
	b.height = 7;

	return;
}



void printArr(int[3] arr) {
	print("[ ");
	print(arr[0]);
	print(", ");
	print(arr[1]);
	print(", ");
	print(arr[2]);
	print(" ]");

	return;
}




void Test_Static_Array() {
	// Construct the array locally to check caching
	int[3] arr;
	arr[0] = 42;
	arr[1] = 12;
	arr[2] = -56;

	printArr(arr);

	int i = 1;
	int j = 2;
	arr[i] = arr[i] + arr[j];

	println(arr[i]);
	printArr(arr);

	return;
}




int Test_Dynamic_Array () {
	int size = sizeof<long>();
	size = size * 4;

	char* addr = malloc(size);
	Array<long>* arr = static_cast< Array<long>* >(addr);

	print("[ ");
	print(arr->[0]);
	print(", ");
	print(arr->[1]);
	print(", ");
	print(arr->[2]);
	print(" ]");

	free(addr);
	return 0;
}




void Test_Pointer() {
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