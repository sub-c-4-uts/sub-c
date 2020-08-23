# Change Log

## v0.0.4

### Added

+ Constants are not longer forcibly written to memory
+ If/While statements now use phi statements to result value changes

### Tweaks

+ New LLVM ID assignment system to allow for out of order code generation

### Fixes

+ Fixed not flushing pointers before function calls
+ Fixed not flushing pointers on return function
+ Fixed not flushing values before while loop
+ Fixed compiler crashing with invalid array access on non-array

## v0.0.3

### Added
### Fixes
### Changes