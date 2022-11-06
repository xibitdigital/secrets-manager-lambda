const { handleRotateCommand } = require("./rotateCommand");
const { handleCopyCommand } = require("./copyCommand");
const { COMMANDS } = process.env;

const cmds = JSON.parse(COMMANDS);

const handlerWithCommands = (commands) => async (event) => {
  let data = [];

  if (Array.isArray(commands)) {
    for (let index = 0; index < commands.length; index++) {
      const command = commands[index];

      if (command.action === "rotate") {
        data = [...data, await handleRotateCommand(command)];
      }

      if (command.action === "copy") {
        data = [...data, await handleCopyCommand(command)];
      }
    }

    return data;
  } else {
    return false;
  }
};

const handler = handlerWithCommands(cmds);

module.exports = {
  handler,
  handlerWithCommands
};
