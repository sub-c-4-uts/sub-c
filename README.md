# Sub-set C

A subset of C with a few C++ syntax extensions only available for primitive functions to simplify the syntax. Developed for UTS' 'secure programing and penetration' testing course

## Setup
First you need do install Clang and NPM, both of which are operating system specific.
<details>
	<summary>Unix</summary>
	On unix installation is quite easy. Just run the two lines below in your terminal
<pre><code>sudo apt-get npm<br>
sudo apt-get clang++</code></pre>
</details>
<details>
	<summary>Windows</summary>
	First simply install NodeJS from <a href="https://nodejs.dev">nodejs.dev</a>, then you need to install clang. To install Clang one Windows you need to have MSVC installed first - to do this follow this <a href="https://docs.microsoft.com/en-us/cpp/build/vscpp-step-0-installation">guide</a>, then once MSVC is installed you can simply download the pre-built binary for you computer from <a href="https://releases.llvm.org/download.html">here</a>
</details>

Clone the repository, then run this command from within the root directory of the repo
```
npm install . -g
```

## CLI Ussage
Once you have followed the setup, NPM has registered ``subc`` as a command that can be used to compile with.
```
subc {entry_file}
```

## Flags

| Flag | Description |
| :- | :- |
| ``-o {name}`` | Specify the output filename from the compiler |
| ``--execute`` | Run the compiled binary produced (if any) |
| ``--version`` | Will log out the current version number of the compiler |
| ``-S`` | Compile to human readable assembly rather than executable |
| ``--llvm`` | Compile to human readable LLVM-IR rather than executable |
