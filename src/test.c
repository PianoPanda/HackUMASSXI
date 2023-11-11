/**
 * Use https://godbolt.org/
 * Then https://riscvasm.lucasteske.dev/#
*/
#include<stdio.h>

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
    softwareDivide(a, b);
}