import { main } from "bun";
import { setpc } from "./execute";
import { RAM_SIZE, memory } from "./ram";

function logByte(x, msg = "") {
    console.log(`${msg}0x${x.toString(16).padStart(2, 0)}`)
}
function logWord(x, msg = "") {
    console.log(`${msg}0x${x.toString(16).padStart(8, 0)}`)
}

export default function loadELF(elfData, startSymbolName = "main") {
    if (typeof (elfData) !== "object" || elfData.constructor !== Uint8Array) throw new Error("Invalid input: loadELF only accepts Uint8Array");
    function getString(addr){
        let builtString = "";
        while (elfData[addr] !== 0) {
            builtString = `${builtString}${String.fromCodePoint(elfData[addr])}`
            addr++;
        }
        return builtString
    }
    function logString(x, msg = "") {
        let builtString = msg
        while (elfData[x] !== 0) {
            builtString = `${builtString}${String.fromCodePoint(elfData[x])}`
            x++;
        }
        console.log(builtString)
    }
    let base = 0;
    function readByte(address) {
        address += base
        return elfData[address]
    }
    function readHalfWord(address) {
        address += base
        return elfData[address] |
            elfData[address + 1] << 8
    }
    function readWord(address) {
        address += base
        return elfData[address] |
            elfData[address + 1] << 8 |
            elfData[address + 2] << 16 |
            elfData[address + 3] << 24
    }

    //====FILE HEADER====
    //Verify Magic Number
    if (readWord(0) !== 0x464C457F) throw new Error("Wrong Magic Number");

    const e_shnum = readHalfWord(0x30);

    const e_shoff = readWord(0x20);

    const e_shstrndx = readHalfWord(0x32);

    logWord(e_shnum, "e_shnum = ")
    logWord(e_shoff, "shoff = ")
    logWord(e_shstrndx, "shstrndx = ")

    //====SECTION HEADERS====
    const sectionManifList = new Array(e_shnum).fill(1).map(() => {
        return {}
    })
    base = e_shoff;
    let nameregBase

    let section_index = 0;
    while (section_index !== e_shnum) {
        const manif = sectionManifList[section_index]
        manif.sh_name = readWord(0);
        manif.sh_type = readWord(0x04);
        manif.sh_flags = readWord(0x08);
        manif.sh_addr = readWord(0x0C);
        manif.sh_offset = readWord(0x10);
        manif.sh_size = readWord(0x14);
        manif.dataSegment = elfData.subarray(manif.sh_offset, manif.sh_offset + manif.sh_size);

        base += 0x28
        section_index++
    }

    const shstrtab = sectionManifList[e_shstrndx]
    const nameBase = shstrtab.sh_offset;

    console.log("sections found:")
    sectionManifList.forEach((manif, sectionID) => {
        logString(nameBase + manif.sh_name, "\t");
        manif.name = getString(nameBase + manif.sh_name);
        logWord(sectionID, "\t\tID = ")
        logWord(manif.sh_type, "\t\ttype = ")
        logWord(manif.sh_addr, "\t\taddr = ")
        logWord(manif.sh_flags, "\t\tflags = ")

        if(manif.sh_flags & 0x2){
            //load into memory
            logWord(manif.dataSegment.length, "\t\tloaded length = ")
            manif.dataSegment.forEach((value, index) => memory[index + manif.sh_addr] = value)
        }
    })

    const symTabSection = sectionManifList.find(manif => manif.sh_type === 2);
    const strTabSection = sectionManifList.find(manif => manif.name === ".strtab");

    const num_symbols = symTabSection.dataSegment.length / 16;
    logWord(num_symbols, "num_symbols = ")
    let symbol_index = 0;
    base = symTabSection.sh_offset;
    const symbolManifList = [];
    while(symbol_index !== num_symbols){
        const manif = {}
        manif.name_ptr = readWord(0)
        manif.address = readWord(4)
        manif.size = readWord(8)
        symbolManifList.push(manif);
        base += 16
        symbol_index++;
    }
    const symbolNameBase = strTabSection.sh_offset;
    console.log("symbol table")
    symbolManifList.forEach((manif) => {
        logString(symbolNameBase + manif.name_ptr, "\t")
        logWord(manif.address, "\t\t")
        manif.name = getString(symbolNameBase + manif.name_ptr)
    })
    const startCode = symbolManifList.find(sym => sym.name === startSymbolName)
    setpc(startCode.address)
    logWord(startCode.address, "setting pc to ");
    //set registers
    //load data segments
    console.log("ELF parsed successfully");
}