import fs from 'fs'
import path from 'path'
import * as glob from 'glob'

const base = path.join(__dirname, '..', 'app', 'api')
const apis = glob.sync(path.join(base, '**', 'index.ts').replace(/\\/g, '/'))
  .filter(p => !p.includes('node_modules'))
  .map(p => path.dirname(p))
  .filter(p => p !== base)
apis.sort()

fs.writeFileSync(path.join(base, 'server.ts'), [
  `/**`,
  ` * This file is autogenerated by cli/sync-api-import.ts`,
  ` *  and exports all API routes recursively in this directory.`,
  ` * It is designed to be imported server-side.`,
  ` */`,
  ...apis
    .flatMap(api => {
      const apiPath = path.relative(base, api)
      return [
        `export * from ${JSON.stringify(`./${apiPath}`)}`,
      ]
    }),
  ].join('\n')
)

fs.writeFileSync(path.join(base, 'client.ts'), [
  `/**`,
  ` * This file is autogenerated by cli/sync-api-import.ts`,
  ` *  and exports all API routes recursively in this directory.`,
  ` * It is designed to be imported client-side.`,
  ` */`,
  `import { APIInterface } from '@/spec/api'`,
  ...apis
    .flatMap(api => {
      const apiPath = path.relative(base, api)
      return [
        ...fs.readFileSync(path.join(api, 'index.ts')).toString().matchAll(
          /export const (\w+) = API.(get|post)\(['"](.+?)['"]\)/g
        )
      ].flatMap((kv) => {
        const key = kv[1] as string
        const apiMethod = kv[2].toUpperCase()
        const apiRoute = kv[3]
        return [
          `import type { ${key} as ${key}_ } from './${apiPath}'`,
          `export const ${key} = APIInterface<typeof ${key}_>(${JSON.stringify(apiRoute)}, ${JSON.stringify(apiMethod)})`
        ]
      })
    }),
  ].join('\n')
)
