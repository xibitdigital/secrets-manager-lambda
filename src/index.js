const { handleRotateCommand } = require("./rotateCommand");
const { handleCopyCommand } = require("./copyCommand");

const { COMMANDS } = process.env;

const handlerWithCommands = (commands) => async (event) => {
  console.log("event triggered", JSON.stringify(event));

  if (Array.isArray(commands)) {
    commands.forEach(async (command) => {
      if (command.action === "rotate") {
        console.log("rotating secret", JSON.stringify(command));

        await handleRotateCommand(command);
      }

      if (command.action === "copy") {
        console.log("copying secret", JSON.stringify(command));

        await handleCopyCommand(command);
      }
    });

    return true;
  } else {
    return false;
  }
};

const handler = handlerWithCommands(JSON.parse(COMMANDS));

module.exports = {
  handler,
  handlerWithCommands
};
