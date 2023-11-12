git clone https://github.com/riscv/riscv-gnu-toolchain testfileartifacts/riscv-gnu-toolchain
cd testfileartifacts/riscv-gnu-toolchain
sudo apt-get install autoconf automake autotools-dev curl python3 python3-pip libmpc-dev libmpfr-dev libgmp-dev gawk build-essential bison flex texinfo gperf libtool patchutils bc zlib1g-dev libexpat-dev ninja-build git cmake libglib2.0-dev
CURRENT_DIR=$(cd .. && pwd)
echo "configuring"
./configure --prefix=$CURRENT_DIR/riscv --with-arch=rv32ima_zicsr --with-abi=ilp32
echo "building"
make linux