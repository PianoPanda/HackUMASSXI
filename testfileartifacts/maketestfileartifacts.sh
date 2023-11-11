# ./configure --prefix=/opt/riscv --with-arch=rv32iam --disable-linux
# make -j $(nproc)

riscv32-unknown-elf-gcc -O1 -nostartfiles -S test.c -o test.s
riscv32-unknown-elf-gcc -O1 -nostartfiles test.c -o test.elf
riscv32-unknown-elf-objcopy -O binary test.elf test.bin
xxd -g 4 -c 4 test.bin > test.hex
