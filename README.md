# lab-creator

# our cli checklist

- [x] Create the program command
- [ ] copy files from `template dir` to `cwd`
  - [ ] future state: specify dest dir
- [ ] Template out the files in the template dir
  - [ ] if the file is the grading.yml workflow it needs a special folder
    - [ ] use fs to create a `.github/worfklows/` directory
    - [ ] place grading.yml here ^^^^^^
  - [x] Replace the lab name in the README etc
  - [x] cli option/cmd that allows us to input a labs name
    - `lab-creator --name "my lab"`
