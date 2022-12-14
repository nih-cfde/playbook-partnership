import React from 'react'
import { MetaNode } from '@/spec/metanode'
import { FileURL } from '@/components/core/file'
import python from '@/utils/python'
import { z } from 'zod'
import { datafile_icon, file_transfer_icon } from '@/icons'
import dynamic from 'next/dynamic'

const Matrix = dynamic(() => import('@/app/components/Matrix'))

export const GeneCountMatrix = MetaNode.createData('GeneCountMatrix')
  .meta({
    label: 'Gene Count Matrix',
    description: 'A gene count matrix file',
    icon: [datafile_icon],
  })
  .codec(z.object({
    url: z.string(),
    shape: z.tuple([z.number(), z.number()]),
    columns: z.array(z.string()),
    index: z.array(z.string()),
    values: z.array(z.array(z.union([z.number(), z.literal('nan'), z.literal('inf'), z.literal('-inf')]))),
    ellipses: z.tuple([z.union([z.number(), z.null()]), z.union([z.number(), z.null()])]),
  }))
  .view(props => {
    return (
      <div>
        <Matrix
          index={props.index}
          columns={props.columns}
          values={props.values}
          ellipses={props.ellipses}
        />
        <p>Shape: ({props.shape[0]}, {props.shape[1]})</p>
        <a style={{ display: 'none' }} href={props.url}>{props.url}</a>
      </div>
    )
  })
  .build()

export const GeneCountMatrixFromFile = MetaNode.createProcess('GeneCountMatrixFromFile')
  .meta({
    label: 'Resolve A Gene Count Matrix from a File',
    description: 'Ensure a file contains a gene count matrix, load it into a standard format',
    icon: [file_transfer_icon],
  })
  .codec()
  .inputs({ file: FileURL })
  .output(GeneCountMatrix)
  .resolve(async (props) => await python(
    'components.data.gene_count_matrix.gene_count_matrix',
    { kargs: [props.inputs.file] },
  ))
  .build()

  export const Transpose = MetaNode.createProcess('Transpose')
  .meta({
    label: 'Transpose',
    description: 'A demonstrative transpose operation',
  })
  .codec()
  .inputs({ file: GeneCountMatrix })
  .output(GeneCountMatrix)
  .resolve(async (props) => await python(
    'components.data.gene_count_matrix.transpose',
    { kargs: [props.inputs.file] },
  ))
  .build()
