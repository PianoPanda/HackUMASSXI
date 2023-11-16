int putchar(int c){
    asm volatile(
        "add a0,%0,x0;"
        ".word 0x80051073;"
        ::"r"(c)
        :"a0"
    );
    // 0b100000000000_11111_001_00000_1110011
    return 0;
}

void shutdown(){
    asm (".word 0x80105073"); //shutdown
}

void print_string(char *str){
    while (*str)
    {
        putchar(*str);
        str++;
    }
}

void _start() {
    main();
}

int main() {
    print_string("Hello World!\n");
    shutdown();
}