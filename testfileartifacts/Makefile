# ./configure --prefix=/opt/riscv --with-arch=rv32iam --disable-linux
# make -j $(nproc)
install:
	git submodule update --init
	

compile: c_test.c
	riscv32-unknown-elf-gcc -O1 c_test.c -S c_test.s
	riscv32-unknown-elf-gcc -O1 c_test.s -o c_test.elf
	make c_elftobin

assemble: asm_test.s
	riscv32-unknown-elf-gcc -O1 -nostartfiles asm_test.s -o asm_test.elf
	make asm_elftobin

c_elftobin: c_test.elf
	riscv32-unknown-elf-objcopy -O binary c_test.elf c_test.bin
	xxd -g 4 -c 4 c_test.bin > c_test.hex
	riscv32-unknown-elf-objdump -d c_test.elf > c_test.dump

asm_elftobin: asm_test.elf
	riscv32-unknown-elf-objcopy -O binary asm_test.elf asm_test.bin
	xxd -g 4 -c 4 asm_test.bin > asm_test.hex
	riscv32-unknown-elf-objdump -m riscv:rv32 -b binary -D asm_test.bin > asm_test.dump

clean:
	rm c_test.s c_test.bin c_test.elf c_test.hex asm_test.bin asm_test.elf asm_test.hex