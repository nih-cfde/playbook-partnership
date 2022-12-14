import { z } from "zod"
import sha256 from '@/utils/sha256'
import type KRG from "@/core/KRG"
import IEE2791schema from '@/spec/bco'
import * as dict from '@/utils/dict'
import * as array from '@/utils/array'
import { FPL } from "./FPPRG"

type BCO = z.infer<typeof IEE2791schema>
type BaseBCO = Omit<BCO, 'etag' | 'object_id' | 'spec_version'>

function toBCOTimeString(date?: Date) {
  if (date === undefined) date = new Date()
  return date.toISOString().replace(/Z$/, '000')
}
type PromiseType<T> = T extends Promise<infer RT> ? RT : never
type FullFPL = Array<PromiseType<ReturnType<FPL['toJSONWithOutput']>>>

export default function FPL2BCO(krg: KRG, fpl: FullFPL): BCO {
  const processLookup = dict.init(fpl.map((step, index) => ({
    key: step.process.id,
    value: {
      index,
      node: step.process,
      metanode: krg.getProcessNode(step.process.type)
    }
  })))
  const baseBCO: BaseBCO = {
    usability_domain: [
      // TODO
      'Some description about this workflow',
    ],
    provenance_domain: {
      embargo: {}, // ?
      name: 'Playbook Partnership',
      version: '1.0',
      license: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
      derived_from: 'NA',
      // TODO: replace with user account info
      //       & authors of components in the workflow
      contributors: [
        {
          name: 'Daniel Clarke',
          orcid: 'https://orcid.org/0000-0003-3471-7416',
          affiliation: 'Mount Sinai',
          contribution: [
            'authoredBy',
          ],
          email: 'danieljbclarkemssm@gmail.com',
        },
      ],
      review: [],
      created: toBCOTimeString(), // TODO: datetime
      modified: toBCOTimeString(), // TODO: datetime
    },
    description_domain: {
      keywords: array.unique(
        Object.values(processLookup)
          .flatMap(({ metanode }) =>
            metanode.meta.tags ? Object.keys(metanode.meta.tags) : []
          )
      ),
      platform: ['Debian GNU/Linux 11'],
      pipeline_steps: Object.values(processLookup).map(({ index, node, metanode }) => ({
        name: metanode.meta.label,
        description: metanode.meta.description,
        // version: metanode.meta.version,
        step_number: index + 1,
        prerequisite: Object.values(node.inputs).map(input => processLookup[input.id]).map(inputProcess => ({
          name: `Output of step ${inputProcess.index+1}`,
          uri: {
            uri: `#/${inputProcess.index}/process/output`,
            access_time: toBCOTimeString(),
          },
        })),
        input_list: Object.values(node.inputs).map(input => processLookup[input.id]).map(inputProcess => ({
          uri: `#/${inputProcess.index}/process/output`,
          access_time: toBCOTimeString(),
        })),
        output_list: [
          {
            uri: `#/${index}/process/output`,
            access_time: toBCOTimeString(),
          }
        ],
      })),
    },
    parametric_domain: Object.values(processLookup).filter(({ node }) => node.data !== null).map(({ index, node, metanode }) => ({
      step: `${index+1}`,
      param: 'stdin',
      value: node.data ? node.data.value : '',
    })),
    execution_domain: {
      // TODO: load prereqs from steps in use (?)
      external_data_endpoints: [],
      software_prerequisites: [
        {
          name: 'Docker',
          version: '20.10.21',
          uri: {
            access_time: toBCOTimeString(),
            uri: 'https://docs.docker.com/get-docker/',
          },
        },
      ],
      environment_variables: {},
      script_driver: 'shell',
      script: [
        {
          uri: {
            uri: 'https://github.com/nih-cfde/playbook-partnership/tree/dev/cli/playbook-partnership-executor.sh',
            filename: 'playbook-partnership-executor.sh',
          }
        }
      ]
    },
    io_domain: {
      input_subdomain: [
        {
          uri: {
            uri: `${process.env.PUBLIC_URL}/api/db/fpl/${fpl[fpl.length-1].id}`,
          },
          // mediatype: 'application/json',
        },
      ],
      output_subdomain: [
        {
          uri: {
            uri: `${process.env.PUBLIC_URL}/api/db/fpl/${fpl[fpl.length-1].id}/output`,
          },
          mediatype: 'application/json'
        }
      ]
    },
    // TODO error_domain
  }
  return {
    spec_version: 'https://w3id.org/ieee/ieee-2791-schema/2791object.json',
    etag: sha256(baseBCO),
    // Note: Object IDs will be minted upstream
    object_id: "",
    ...baseBCO,
  }
}
