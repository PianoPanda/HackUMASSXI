import { test } from "bun:test";
import { format32 } from "./util";
import assert from "assert";

test("format32: -1", () => {
    assert(format32(-1) === 0xFFFF_FFFF);
});

test("format32: 0x0000_00FF", () => {
    assert(format32(0x0000_00FF) === 0x0000_00FF);
});

test("format32: 0x1_0000_0000", () => {
    assert(format32(0x1_0000_0000) === 0x0000_0000);
});

test("format32: 0x1_ABCD_1234", () => {
    assert(format32(0x1_ABCD_1234) === 0xABCD_1234);
});

test("format32: 0x1_ABCD_1234 * 0x1_ABCD_1234", () => {
    assert(format32(0x1_ABCD_1234 * 0x1_ABCD_1234) === format32(0xABCD_1234 * 0xABCD_1234));
});