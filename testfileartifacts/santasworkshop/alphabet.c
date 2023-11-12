/**
 * Alphabet
*/
int putchar(int c){
    asm volatile(
        "add a0,%0,x0;"
        ".word 0x80051073;"
        :"=r"(c)
    );
    return 0;
    // asm (".word 0b100000000000_11111_001_00000_1110011");
}
void print_alpha(){
    for(char c = 'A'; c <= 'Z'; c++) putchar(c);
}
void shutdown(){
    asm (".word 0x80105073"); //shutdown
}
int main() {
    print_alpha();
    shutdown();
}