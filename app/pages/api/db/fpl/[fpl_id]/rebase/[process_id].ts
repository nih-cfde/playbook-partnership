import fpprg from '@/app/fpprg'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { IdOrProcessC } from '@/core/FPPRG'

const QueryType = z.object({
  fpl_id: z.string(),
  process_id: z.string(),
})

const BodyType = IdOrProcessC

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') throw new Error('Unsupported method')
    const { fpl_id, process_id } = QueryType.parse(req.query)
    const old_process = await fpprg.getProcess(process_id)
    if (old_process === undefined) {
        res.status(404).end()
    } else {
      const new_process = await fpprg.resolveProcess(BodyType.parse(JSON.parse(req.body)))
      const old_fpl = await fpprg.getFPL(fpl_id)
      if (old_fpl === undefined) {
        res.status(404).end()
      } else {
        const { rebased, head } = old_fpl.rebase(old_process, new_process)
        const fpl = await fpprg.upsertFPL(head)
        res.status(200).json({ head: fpl.id, rebased: rebased.id })
      }
    }
  } catch (e) {
    console.error(e)
    res.status(500).end((e as Error).toString())
  }
}
