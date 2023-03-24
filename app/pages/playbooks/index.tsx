import React from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { view_report_icon } from '@/icons'
import Link from 'next/link'
import * as dict from '@/utils/dict'
import * as array from '@/utils/array'
import tsvector, { type TSVector } from "@/utils/tsvector"
import { DataMetaNode } from '@/spec/metanode'
import useAsyncEffect from 'use-async-effect'
import { useRouter } from 'next/router'

import ARCHS4_icon from '@/app/public/logos/datasources/ARCHS4.png'
import ChEA3_icon from '@/app/public/logos/datasources/ChEA3.png'
import ENCODE_icon from '@/app/public/logos/datasources/ENCODE.png'
import GTEx_icon from '@/app/public/logos/datasources/GTEx.png'
import GWAS_icon from '@/app/public/logos/datasources/GWAS.jpeg'
import IMPC_icon from '@/app/public/logos/datasources/IMPC.png'
import KOMP_icon from '@/app/public/logos/datasources/KOMP.png'
import LINCS_icon from '@/app/public/logos/datasources/LINCS.gif'
import Image, { StaticImageData } from 'next/image'
import classNames from 'classnames'

const dataSourceIcons: Record<string, StaticImageData> = {
  ARCHS4: ARCHS4_icon,
  ChEA: ChEA3_icon,
  ENCODE: ENCODE_icon,
  GTEx: GTEx_icon,
  'GWAS Catalog': GWAS_icon,
  IMPC: IMPC_icon,
  KOMP: KOMP_icon,
  'LINCS L1000': LINCS_icon,
}

const Icon = dynamic(() => import('@/app/components/icon'))
const Layout = dynamic(() => import('@/app/fragments/playbook/layout'))

type Playbook = {
  id: string,
  label: string,
  description: string,
  published: string,
  version: string,
  authors: string[],
  licenseUrl: string,
  license: string,
  url: string,
  dataSources: string[],
  inputs: Array<DataMetaNode>,
  outputs: Array<DataMetaNode>,
  clicks: number,
}

export default function Playbooks() {
  const router = useRouter()
  const [dataSourceFilters, setDataSourceFilters] = React.useState<Record<string, boolean>>({})
  const [inputFilters, setInputFilters] = React.useState<Record<string, boolean>>({})
  const [outputFilters, setOutputFilters] = React.useState<Record<string, boolean>>({})
  const [details, setDetails] = React.useState<Record<string, boolean>>({})
  const [playbooks, setPlaybooks] = React.useState<Array<Playbook>>()
  const [search, setSearch] = React.useState('')
  const playbook_tsvectors = React.useMemo(() => {
    const playbook_tsvectors: Record<string, TSVector> = {}
    playbooks?.forEach(playbook => {
      playbook_tsvectors[playbook.id] = tsvector([
        playbook.label,
        playbook.description,
        playbook.published,
        ...playbook.inputs.flatMap(input => [
          input.meta.label,
          input.meta.description,
        ]),
        ...playbook.outputs.flatMap(output => [
          output.meta.label,
          output.meta.description,
        ]),
        ...playbook.dataSources,
      ].join(' '))
    })
    return playbook_tsvectors
  }, [playbooks])
  const { allInputs, allOutputs, allDataSources, isLoading } = React.useMemo(() => {
    const allInputs: Record<string, DataMetaNode> = {}
    const allOutputs: Record<string, DataMetaNode> = {}
    const allDataSources: Record<string, string> = {}
    let isLoading = true
    if (playbooks) {
      playbooks.forEach(playbook => {
        playbook.inputs.forEach(input => {
          allInputs[input.spec] = input as DataMetaNode
        })
        playbook.outputs.forEach(output => {
          allOutputs[output.spec] = output as DataMetaNode
        })
        playbook.dataSources.forEach(dataSource => {
          allDataSources[dataSource] = dataSource
        })
      })
      isLoading = false
    }
    return { allInputs, allOutputs, allDataSources, isLoading }
  }, [playbooks])
  const filteredPlaybooks = React.useMemo(() => {
    if (!playbooks) return
    return playbooks.filter(playbook => {
      return array.all([
        ...dict.keys(inputFilters).map(filter => playbook.inputs.filter(input => input.spec === filter).length > 0),
        ...dict.keys(outputFilters).map(filter => playbook.outputs.filter(output => output.spec === filter).length > 0),
        ...dict.keys(dataSourceFilters).map(filter => playbook.dataSources.filter(dataSource => dataSource === filter).length > 0),
      ])
    })
  }, [playbooks, inputFilters, outputFilters, dataSourceFilters])
  const searchFilteredPlaybooks = React.useMemo(() => {
    if (!filteredPlaybooks) return
    if (!search) return filteredPlaybooks
    const search_tsvector = tsvector(search)
    const search_scores: Record<string, number> = {}
    filteredPlaybooks.forEach(playbook => {
      search_scores[playbook.id] = playbook_tsvectors[playbook.id]?.intersect(search_tsvector).size
    })
    const searchFilteredPlaybooks = filteredPlaybooks.filter(playbook => search_scores[playbook.id] > 0)
    searchFilteredPlaybooks.sort((a, b) => search_scores[b.id] - search_scores[a.id])
    return searchFilteredPlaybooks
  }, [filteredPlaybooks, search])
  useAsyncEffect(async (isMounted) => {
    const { default: demoPlaybooks } = await import('@/app/public/playbooksDemo')
    if (!isMounted()) return
    setPlaybooks(demoPlaybooks as Array<Playbook>)
  }, [])
  const DataSourceButton = React.useCallback(({ dataSource, size }: { dataSource: string, size: number }) => (
    <button
      key={dataSource}
      onClick={() => {
        setDataSourceFilters(({ [dataSource]: cur, ...filters }) => {
          if (!cur) return {...filters, [dataSource]: !cur}
          else return filters
        })
      }}
      className="flex flex-col place-items-center underline"
    >
      <span className={classNames({ 'text-shadow': dataSourceFilters[dataSource] })}>{dataSource}</span>
      {dataSource in dataSourceIcons ?
        <Image src={dataSourceIcons[dataSource]} objectFit="scale-down" width={size} height={size} />
        : null}
    </button>
  ), [dataSourceFilters, setDataSourceFilters])
  return (
    <Layout>
      <Head>
        <title>Playbooks</title>
      </Head>

      <main className="flex-grow container mx-auto py-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div className="prose"><h2>Data Sources</h2></div>
            <div className="flex flex-row flex-wrap gap-2">
              {dict.values(allDataSources).map(dataSource => (
                <DataSourceButton
                  key={dataSource}
                  dataSource={dataSource}
                  size={80}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <div className="flex-grow flex flex-col gap-2">
              <div className="prose"><h2>Inputs</h2></div>
              <div className="flex flex-row flex-wrap gap-2">
                {dict.values(allInputs).map(input => (
                  <button
                    key={input.spec}
                    onClick={() => {
                      setInputFilters(({ [input.spec]: cur, ...filters }) => {
                        if (!cur) return {...filters, [input.spec]: !cur}
                        else return filters
                      })
                    }}
                  >
                    <Icon
                      container="circle"
                      container_color={inputFilters[input.spec] ? '#B3CFFF' : '#ddd'}
                      size={1.5}
                      icon={input.meta.icon}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-grow flex flex-col gap-2">
              <div className="prose"><h2>Outputs</h2></div>
              <div className="flex flex-row flex-wrap gap-2">
                {dict.values(allOutputs).map(output => (
                  <button
                    key={output.spec}
                    onClick={() => {
                      setOutputFilters(({ [output.spec]: cur, ...filters }) => {
                        if (!cur) return {...filters, [output.spec]: !cur}
                        else return filters
                      })
                    }}
                  >
                    <Icon
                      key={output.spec}
                      container="circle"
                      container_color={outputFilters[output.spec] ? '#B3CFFF' : '#ddd'}
                      size={1.5}
                      icon={output.meta.icon}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bp4-input-group">
          <span className="bp4-icon bp4-icon-search" />
          <input
            type="search"
            className="bp4-input"
            placeholder="Search playbooks by title, description, and more"
            value={search}
            onChange={evt => {
              setSearch(() => evt.target.value)
            }}
          />
        </div>
        <div>
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th className="text-center">Playbook</th>
                <th className="text-center">Inputs</th>
                <th className="text-center">Outputs</th>
                <th className="text-center">Sources</th>
                <th className="text-center">Clicks</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ?
                <tr>
                  <td colSpan={5}>
                    <progress className="progress w-full"></progress>
                  </td>
                </tr>
                : null}
              {searchFilteredPlaybooks ?
                searchFilteredPlaybooks.length > 0 ?
                  searchFilteredPlaybooks.flatMap(playbook => [
                    <tr key={playbook.id}>
                      <td>
                        <div className="tooltip z-50" data-tip="Click to view details">
                          <button
                            className="btn btn-ghost text-4xl"
                            onClick={evt => {
                              setDetails(({ [playbook.id]: cur, ...details }) => cur ? details : ({ ...details, [playbook.id]: true }))
                            }}
                          >{details[playbook.id] ? '-' : '+'}</button>
                        </div>
                      </td>
                      <td className="prose">{playbook.label}</td>
                      <td>
                        <div className="flex flex-row flex-wrap gap-2 justify-center">
                          {playbook.inputs.map(input => (
                            <button
                              key={input.spec}
                              onClick={() => {
                                setInputFilters(({ [input.spec]: cur, ...filters }) => {
                                  if (!cur) return {...filters, [input.spec]: !cur}
                                  else return filters
                                })
                              }}
                            >
                              <Icon
                                container="circle"
                                container_color={inputFilters[input.spec] ? '#B3CFFF' : '#ddd'}
                                size={1.5}
                                icon={input.meta.icon}
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-row flex-wrap gap-2 justify-center">
                          {playbook.outputs.map(output => (
                            <button
                              key={output.spec}
                              onClick={() => {
                                setOutputFilters(({ [output.spec]: cur, ...filters }) => {
                                  if (!cur) return {...filters, [output.spec]: !cur}
                                  else return filters
                                })
                              }}
                            >
                              <Icon
                                key={output.spec}
                                container="circle"
                                container_color={outputFilters[output.spec] ? '#B3CFFF' : '#ddd'}
                                size={1.5}
                                icon={output.meta.icon}
                              />
                            </button>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-row flex-wrap gap-2 justify-center">
                          {playbook.dataSources.map(dataSource => (
                            <DataSourceButton
                              key={dataSource}
                              dataSource={dataSource}
                              size={50}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="prose text-center">
                        {playbook.clicks}
                      </td>
                      <td>
                        <div className="flex flex-row gap-2 justify-center">
                          <button onClick={() => {
                            // TODO: register click
                            router.push(playbook.url)
                          }}>
                            <Icon icon={view_report_icon} color="black" title="Launch Playbook" />
                          </button>
                        </div>
                      </td>
                    </tr>,
                    <tr key={`${playbook.id}-details`} className={details[playbook.id] ? 'display' : 'hidden'}>
                      <td colSpan={6}>
                        <div className="mx-auto prose whitespace-normal">
                          <div className="flex flex-row gap-2 flex-wrap">
                            <div className="badge badge-primary">v{playbook.version}</div>
                            <div className="badge bg-gray-300 border-none"><a className="no-underline text-blue-700" href={playbook.licenseUrl} target="blank">{playbook.license}</a></div>
                          </div>
                          <p><b>Published</b>: {playbook.published}</p>
                          <p><b>Authors</b>:<br />{playbook.authors.join(', ')}</p>
                          <p><b>Description</b>: {playbook.description}</p>
                          <Link href={playbook.url}><button className="bp4-button bp4-large">Launch</button></Link>
                        </div>
                      </td>
                    </tr>
                  ])
                : <tr>
                  <td colSpan={5}>
                    <div className="alert">No playbooks currently registered matching this criteria.</div>
                  </td>
                </tr>
                : null}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  )
}