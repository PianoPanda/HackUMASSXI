import * as decode from "./decode.js";
import {test, expect} from "bun:test";

test("bitsfrom", () => {
    const testBit = 0b0011110;
    console.log((decode.bitsfrom(testBit, 1, 3) >>> 0).toString(2));
    expect(decode.bitsfrom(testBit, 1, 3))
        .toBe(0b111);
    expect(decode.bitsfrom(testBit, 2, 3))
    .toBe(0b111);
    expect(decode.bitsfrom(testBit, 0, 3))
    .toBe(0b110);
    expect(() => {decode.bitsfrom(testBit, 0, 0)})
    .toThrow();
});


test("combine", () => {
    // const testBit = 0b0011110;
    // console.log((decode.bitsfrom(testBit, 1, 3) >>> 0).toString(2));
    // expect(decode.bitsfrom(testBit, 1, 3))
    //     .toBe(0b1111);
    // expect(decode.bitsfrom(testBit, 2, 3))
    // .toBe(0b0111);
    // expect(decode.bitsfrom(testBit, 1, 3))
    // .toBe(0b1111);
    // expect(() => {decode.bitsfrom(testBit, 0, 0)})
    // .toThrow();
});
