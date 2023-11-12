	.file	"test.c"
	.option nopic
	.attribute arch, "rv32i2p1_m2p0_a2p1"
	.attribute unaligned_access, 0
	.attribute stack_align, 16
	.text
	.align	2
	.globl	_start
	.type	_start, @function
_start:
	# Instructions here

	add x0,x0,x0
	li t0,1
	li t1,2
	add t2,t0,t1
	jal skip
	li t0,127
	skip:
	li t3,255
	
	.size	_start, .-_start
	.ident	"GCC: (gc891d8dc23e) 13.2.0"
