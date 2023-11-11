# ./configure --prefix=/opt/riscv --with-arch=rv32iam --disable-linux
# make -j $(nproc)

compile: test.c
	riscv32-unknown-elf-gcc -O1 -nostartfiles test.c -o test.elf
	make elftobin

assemble: test.s
	riscv32-unknown-elf-gcc -O1 -nostartfiles test.s -o test.elf
	make elftobin

elftobin: test.elf
	riscv32-unknown-elf-objcopy -O binary test.elf test.bin
	xxd -g 4 -c 4 test.bin > test.hex

clean:
	rm test.bin test.elf test.hex