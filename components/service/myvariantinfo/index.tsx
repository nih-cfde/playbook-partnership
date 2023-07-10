import { MetaNode } from '@/spec/metanode'
import { GeneTerm, VariantTerm } from '@/components/core/input/term'
import { z } from 'zod'
import { gene_icon, mygeneinfo_icon } from '@/icons'

const z_maybe_array = (inner: z.ZodType) => z.union([inner, z.array(inner)])

export const MyVariantInfoC = z.object({
  _id: z.string(),
  dbsnp: z.object({
    gene: z.object({
      geneid: z.number().optional(),
      symbol: z.string().optional(),
    }).optional(),
  }).optional(),
  clinvar: z.object({
    variant_id: z.number().optional(),
    gene: z.object({
      id: z.string().optional(),
      symbol: z.string().optional(),
    }),
    rcv: z_maybe_array(z.object({
      accession: z.string().optional(),
      clinical_significance: z.string().optional(),
      conditions: z.object({
        name: z.string().optional(),
      }).optional(),
    })).optional(),
  }).optional(),
})

export type MyVariantInfo = z.infer<typeof MyVariantInfoC>

async function myvariantinfo(variantId: string): Promise<MyVariantInfo> {
  const req = await fetch(`https://myvariant.info/v1/variant/${encodeURIComponent(variantId)}`)
  return await req.json()
}

export const MyVariantInfo = MetaNode('MyVariantInfo')
  .meta({
    label: 'Variant Information',
    description: 'A Variant resolved with MyVariantInfo',
    icon: [gene_icon],
  })
  .codec(MyVariantInfoC)
  .view(variantinfo => (
    <div>
      {variantinfo.id}
    </div>
  ))
  .build()

export const MyVariantInfoFromVariantTerm = MetaNode('MyVariantInfoFromVariantTerm')
  .meta({
    label: 'Resolve Variant Info from Term',
    description: 'Resolve variant info from variant term with MyVariantInfo',
    icon: [mygeneinfo_icon],
  })
  .inputs({ variant: VariantTerm })
  .output(MyVariantInfo)
  .resolve(async (props) => {
      return MyVariantInfoC.parse(await myvariantinfo(props.inputs.variant))
  })
  .story(props =>
    `More information about the variant was then obtained with the MyVariant.info API.`
  )
  .build()

export const GeneTermFromMyVariantInfo = MetaNode('GeneTermFromMyVariantInfo')
  .meta({
    label: 'Identify Closest Gene to Variant',
    description: 'Identify the closest gene to this variant',
    icon: [mygeneinfo_icon],
  })
  .inputs({ info: MyVariantInfo })
  .output(GeneTerm)
  .resolve(async (props) => {
    let gene: string | undefined
    if (gene === undefined) gene = props.inputs.info.dbsnp?.gene?.symbol
    if (gene === undefined) gene = props.inputs.info.clinvar?.gene?.symbol
    if (gene === undefined) throw new Error('Gene not identified in MyVariantInfo')
    return gene
  })
  .build()

export const GeneTermFromVariantTerm = MetaNode('GeneTermFromVariantTerm')
  .meta({
    label: 'Identify Closest Gene to Variant',
    description: 'Identify the closest gene to this variant',
    icon: [mygeneinfo_icon],
  })
  .inputs({ variant: VariantTerm })
  .output(GeneTerm)
  .resolve(async (props) => {
    const info = await MyVariantInfoFromVariantTerm.resolve(props)
    return await GeneTermFromMyVariantInfo.resolve({ inputs: { info }})
  })
  .build()
