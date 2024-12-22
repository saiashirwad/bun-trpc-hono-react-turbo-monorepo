import { userSchema } from "@template/schemas";

export function validateUser(user: unknown) {
	return userSchema.parse(user);
}
