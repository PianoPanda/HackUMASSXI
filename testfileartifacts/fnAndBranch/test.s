	.file	"test.c"
	.option nopic
	.attribute arch, "rv32i2p1_m2p0_a2p1"
	.attribute unaligned_access, 0
	.attribute stack_align, 16
	.text
	.align	2
	.globl	fn
	.type	fn, @function
fn:
	addi	sp,sp,-16
	sw	s0,12(sp)
	addi	s0,sp,16
	nop
	lw	s0,12(sp)
	addi	sp,sp,16
	jr	ra
	.size	fn, .-fn
	.align	2
	.globl	_start
	.type	_start, @function
_start:
	addi	sp,sp,-32
	sw	ra,28(sp)
	sw	s0,24(sp)
	addi	s0,sp,32
	sw	zero,-20(s0)
	call	fn
	li	a5,0
	mv	a0,a5
	lw	ra,28(sp)
	lw	s0,24(sp)
	addi	sp,sp,32
	jr	ra
	.size	_start, .-_start
	.ident	"GCC: (gc891d8dc23e) 13.2.0"
