void fn() {

}

int _start() {
    int a;
    if (1) {
        a = 0;
        fn();
    } else {
        a = 1;
    }

    return 0;
}