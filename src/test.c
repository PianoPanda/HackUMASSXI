/**
 * Use https://godbolt.org/ NOTE add call main to the beginning of the asm file
 * Then https://riscvasm.lucasteske.dev/#
*/
//takes in positive integers only, returns a/b rounded down
int softwareDivide(unsigned int a, unsigned int b){
    unsigned int c = 0;
    while(a > b){
        a -= b;
        c++;
    }
    return c;
}

int main(){
    volatile unsigned int a = 12;
    volatile unsigned int b = 4;
    volatile unsigned int c;
    c = softwareDivide(a, b);
    return c ^ 3;
}