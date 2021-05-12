const fs = require("fs-extra");

fs.mkdirSync(`${process.cwd()}/bread`);
fs.writeFileSync(`${process.cwd()}/bread/file.txt`, "some text", "utf-8");
