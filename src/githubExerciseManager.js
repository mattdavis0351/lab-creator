const commander = require("commander");
const fs = require("fs-extra");
const tmp = require("tmp-promise");
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
        .option("-a,--action-name <local-action-name>","User defined name for the local action of the exercise", "local-action")
        .action(async (options) => {
            const exerciseName = options.exerciseName;
            const lgVersion = options.lgVersion 
            const actionName = options.actionName;
            const exercise = await createExercise(exerciseName, lgVersion,actionName);
            console.log(`Exercise ${exercise.name} created`);
            
        });
    program.parse(process.argv);
    }

async function createExercise(exerciseName, lgVersion,actionName){
    const exercise = {
        name: exerciseName,
        lgVersion: lgVersion,
        actionName: actionName,
        files: [],
        tests: []
    };

    const tempPath = await tmp.dir({unsafeCleanup: true});
    await makeRequiredDirs(exercise);

    exercise.files = findTemplateFiles(`${tempPath.path}/node_modules/${packageJSON.name}/templates`)

    return exercise;

}

async function makeRequiredDirs(exercise){
    const requiredDirs = [
        `${process.cwd()}/.github/workflows`,
        `${process.cwd()}/.github/actions/${exercise.actionName}`
    ];
    for(const dir of requiredDirs){
        await fs.ensureDir(dir);
    }
}

init();



// remove init once we have a working version
init();


module.exports = {init};