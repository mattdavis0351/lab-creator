const commander = require("commander");
const packageJSON = require("../package.json");
const getLatestLookingGlassVersion = require("./checkForUpdates");
const findTemplateFiles = require("./findTemplateFiles");

async function init(){
    const program = new commander.Command("ghexmgr");
    program.version(packageJSON.version);
    program.command("new-exercise")
        .description("Create a new exercise")
        .requiredOption("-n,--exercise-name <exercise-name>")
        .option("-v,--lg-version <looking-glass-version>","Looking Glass version you wish to use in the grading.yml exercise file",await getLatestLookingGlassVersion())
        .action(async (options) => {
            const exerciseName = options.exerciseName;
            const lgVersion = options.lgVersion 
            const exercise = await createExercise(exerciseName, lgVersion);
            console.log(`Exercise ${exercise.name} created`);
            
        });
    program.parse(process.argv);
    }

async function createExercise(exerciseName, lgVersion){
    const exercise = {
        name: exerciseName,
        lgVersion: lgVersion,
        files: [],
        tests: []
    };


    exercise.files = findTemplateFiles(`${tempDir.path}/node_modules/${packageJSON.name}/templates`)

    return exercise;

}



// remove init once we have a working version
init();


module.exports = {init};