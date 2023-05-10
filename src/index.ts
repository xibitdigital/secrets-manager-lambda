import { handleRotateCommand } from "./rotateCommand";
import { handleCopyCommand } from "./copyCommand";
import {
	SecretsManagerCommands,
	SecretsManagerRotateCommand,
	SecretsManagerCopyCommand,
} from "./types";

const { COMMANDS } = process.env;

const cmds: SecretsManagerCommands = COMMANDS ? JSON.parse(COMMANDS) : null;

export const handlerWithCommands =
	(commands: SecretsManagerCommands | null) => async (event: any) => {
		let data: any[] = [];

		if (Array.isArray(commands)) {
			for (let index = 0; index < commands.length; index++) {
				const command = commands[index];

				if (command.action === "rotate") {
					data = [
						...data,
						await handleRotateCommand(command as SecretsManagerRotateCommand),
					];
				}

				if (command.action === "copy") {
					data = [
						...data,
						await handleCopyCommand(command as SecretsManagerCopyCommand),
					];
				}
			}

			return {
				statusCode: 200,
				body: data,
			};
		} else {
			return {
				statusCode: 400,
				body: "no commands specified",
			};
		}
	};

export const handler = handlerWithCommands(cmds);
