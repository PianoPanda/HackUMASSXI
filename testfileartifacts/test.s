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
	ret
	.size	_start, .-_start
	.ident	"GCC: (gc891d8dc23e) 13.2.0"
