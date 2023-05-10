import { getSecret, updateSecret } from "./secretsManager";
import { SecretsManagerCopyCommand } from "./types";

type ArityOneFn = (arg: any) => any;

export const compose =
	(...fns: ArityOneFn[]) =>
	(p: any) =>
		fns.reduceRight((acc: any, cur: any) => cur(acc), p);

export const findInKeys = (keys: string[]) => (str: string) =>
	keys.filter((x) => String(str).indexOf(`${x}`) > -1);

export const filterObjectByKeys = (searchKey: any) =>
	compose(
		Object.fromEntries,
		(arr) => arr.filter((pair: string[]) => searchKey(pair[0]).length > 0),
		Object.entries,
	);

export const filterSecret = (keys: string[]) =>
	compose(filterObjectByKeys, findInKeys(keys));

export const handleCopyCommand = async (command: SecretsManagerCopyCommand) => {
	const { secretSourceArn, secretDestination, keys } = command;
	const data = await getSecret(secretSourceArn);

	if (Object.keys(data).length > 0) {
		const filteredSecret = filterSecret(keys)(data);
		const res = await updateSecret(secretDestination, filteredSecret);

		return res;
	}

	return false;
};
