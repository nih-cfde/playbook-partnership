import React from 'react'
import * as dict from '@/utils/dict'
import { MetaNode } from '@/spec/metanode'
import krg from '@/app/krg'
import useSWR from 'swr'

export default function useKRG() {
  const { data: suggestions, error } = useSWR(`/api/suggest`)
  const [krg_, setKrg_] = React.useState({ krg })
  React.useEffect(() => {
    if (!suggestions) return
    for (const suggestion of dict.values(suggestions)) {
      let OutputNode = krg.getDataNode(suggestion.output)
      if (OutputNode === undefined) {
        OutputNode = MetaNode.createData(suggestion.output)
          .meta({
            label: suggestion.output,
            description: `A data type, suggested as part of ${suggestion.name}`,
          })
          .codec<any>()
          .view((props) => {
            return <div>This data type was suggested as part of {suggestion.name}</div>
          })
          .build()
        krg.add(OutputNode)
        setKrg_({ krg })
      }
      let ProcessNode = krg.getProcessNode(suggestion.name)
      if (ProcessNode === undefined) {
        const ProcessNode = MetaNode.createProcess(suggestion.name)
          .meta({
            label: suggestion.name,
            description: suggestion.description,
          })
          .inputs(suggestion.inputs ?
              dict.init(suggestion.inputs.split(',').map((spec: string, ind: number) =>
                ({ key: ind.toString(), value: krg.getDataNode(spec) })))
              : {} as any)
          .output(OutputNode)
          .prompt((props) => {
            return <div>This was suggested by {suggestion.author_name} &lt;{suggestion.author_email}&gt; ({suggestion.author_org})</div>
          })
          .build()
        krg.add(ProcessNode)
        setKrg_({ krg })
      }
    }
  }, [suggestions])
  return krg_.krg
}
