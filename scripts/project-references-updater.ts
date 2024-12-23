import { FileSystem } from "@effect/platform";
import { BunFileSystem } from "@effect/platform-bun";
import { Effect, Ref, Stream } from "effect";

const main = Effect.gen(function* () {
	const fileNamesRef = yield* Ref.make<string[]>([]);
	const fs = yield* FileSystem.FileSystem;

	const files = Stream.mergeAll({
		concurrency: "unbounded",
	})([fs.watch("packages"), fs.watch("package.json")]);

	yield* fs.watch("packages").pipe(
		Stream.runForEach((event) =>
			Effect.gen(function* () {
				console.log(event);
			}),
		),
	);
});

Effect.runPromise(main.pipe(Effect.provide(BunFileSystem.layer)));
