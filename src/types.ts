type SecretsMagerCommand = {
	action: "rotate" | "copy";
	keys: string[];
};

export type SecretsManagerCopyCommand = {
	secretSourceArn: string;
	secretDestination: string;
} & SecretsMagerCommand;

export type SecretsManagerRotateCommand = {
	secretArn: string;
} & SecretsMagerCommand;

export type SecretsManagerCommands = Array<
	SecretsManagerCopyCommand | SecretsManagerRotateCommand
>;
