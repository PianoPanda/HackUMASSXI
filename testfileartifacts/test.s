	.file	"test.c"
	.option nopic
	.attribute arch, "rv32i2p1_m2p0_a2p1"
	.attribute unaligned_access, 0
	.attribute stack_align, 16
	.text
	.align	2
	.globl	fibonacci
	.type	fibonacci, @function
fibonacci:
	addi	sp,sp,-16
	sw	ra,12(sp)
	sw	s0,8(sp)
	mv	s0,a0
	addi	a0,a0,-1
	call	fibonacci
	add	a0,a0,s0
	lw	ra,12(sp)
	lw	s0,8(sp)
	addi	sp,sp,16
	jr	ra
	.size	fibonacci, .-fibonacci
	.align	2
	.globl	_start
	.type	_start, @function
_start:
	addi	sp,sp,-16
	sw	ra,12(sp)
	li	a0,100
	call	fibonacci
	lui	a5,%hi(output)
	sw	a0,%lo(output)(a5)
	lw	ra,12(sp)
	addi	sp,sp,16
	jr	ra
	.size	_start, .-_start
	.globl	output
	.section	.sbss,"aw",@nobits
	.align	2
	.type	output, @object
	.size	output, 4
output:
	.zero	4
	.ident	"GCC: (gc891d8dc23e) 13.2.0"
