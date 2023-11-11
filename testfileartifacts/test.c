volatile int output;

int fibonacci(int n) {
    return n + fibonacci(n-1);
}

int _start() {
    output = fibonacci(100);
}