# lab-creator

# our cli checklist

- [x] Create the program command
- [x] copy files from `template dir` to `cwd`
  - [ ] future state: specify dest dir
- [x] Template out the files in the template dir
  - [x] if the file is the grading.yml workflow it needs a special folder
    - [x] use fs to create a `.github/worfklows/` directory
    - [x] place grading.yml here ^^^^^^
  - [x] Replace the lab name in the README etc
  - [x] cli option/cmd that allows us to input a labs name
    - `lab-creator --name "my lab"`
  - [x] future state is to update node_modules/@org/lab-creator/templates path for copying
- [x] push to npm
- [ ] Update README with usage instructions
- [x] Template out desired files
- [x] Use latest LG version
  - [x] Provide ability to specify LG version if latest isn't desired
