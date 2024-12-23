import { FileSystem } from '@effect/platform'
import { BunFileSystem } from '@effect/platform-bun'
import { Effect, Ref, Stream } from 'effect'

const main = Effect.gen(function* () {
  const fileNames = yield* Ref.make<string[]>([])
  const fs = yield* FileSystem.FileSystem

  const haha = fileNames

  const filesList = Effect.succeed([
    fs.watch('packages'),
    fs.watch('package.json'),
  ])

  const files = filesList.pipe(() =>
    Stream.mergeAll({
      concurrency: 'unbounded',
    }),
  )

  yield* fs.watch('packages').pipe(
    Stream.runForEach((event) =>
      Effect.gen(function* () {
        console.log(event)
      }),
    ),
  )
})

Effect.runPromise(main.pipe(Effect.provide(BunFileSystem.layer)))
