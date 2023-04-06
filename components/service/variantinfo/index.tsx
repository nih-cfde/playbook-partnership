import React from 'react'
import { MetaNode } from '@/spec/metanode'
import { VariantTerm } from '@/components/core/input/term'
import { RegulatoryElementSet } from '@/components/core/input/set'
import { z } from 'zod'

export const MyVariantInfoC =  z.object({
    data: z.object({
      entId: z.string(),
      entType: z.string(),
      ld: z.object({
        xqtlEvidence: z.array(
            z.object({ entId: z.string() })
          )
      }),
      ldFor: z.object({
        RegulatoryElement: z.array(
            z.object({ entId: z.string() })
          )
      })
    })
  })

export type MyVariantInfo = z.infer<typeof MyVariantInfoC>

export const VariantInfo = MetaNode('VariantInfo')
  .meta({
    label: 'Variant Information',
    description: 'A Variant resolved with MyVariantInfo',
  })
  .codec(MyVariantInfoC)
  .view(varinatinfo => (
    <div>
      <a target="_blank" href={`https://reg.clinicalgenome.org/redmine/projects/registry/genboree_registry/by_canonicalid?canonicalid=${varinatinfo.data.entId}`}>{varinatinfo.data.entId}</a> (variant)
    </div>  
  ))
  .build()

async function myvariantinfo_query(variantId: string): Promise<MyVariantInfo> {
    const res = await fetch(`https://genboree.org/cfde-gene-dev/Variant/id/${encodeURIComponent(variantId)}`)
    return await res.json()
  }

export const VarinatInfoFromVariantTerm = MetaNode('VarinatInfoFromVariantTerm')
  .meta({
    label: 'Resolve Variant Info from Term',
    description: 'Resolve variant info from Linked Data Hub [https://genboree.org/cfde-gene-dev/]',
  })
  .inputs({ variant: VariantTerm })
  .output(VariantInfo)
  .resolve(async (props) => {
    return await myvariantinfo_query(props.inputs.variant);
  })
  .build()


export const GetRegulatoryElementsForVariantInfo = MetaNode('GetRegulatoryElementsForVariantInfo')
.meta({
  label: 'Resolve Reg. Elements from Var. Info',
  description: 'GetRegulatoryElementsForVariantInfo',
})
.inputs({ variantInfo: VariantInfo  })
.output(RegulatoryElementSet)
.resolve(async (props) => {
 /*
  let regElemArray = [];
  let regElemFromVariant = props.inputs.variantInfo.data.ldFor.RegulatoryElement;
  for(let r in regElemFromVariant){
    regElemArray.push(regElemFromVariant[r].entId);
  }
  //return regElemArray;
  */
  return { set: props.inputs.variantInfo.data.ldFor.RegulatoryElement.map(({ entId }) => entId) }
})
.build()
