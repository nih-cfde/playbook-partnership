/**
 * Knowledge Resolution Graph (KRG)
 * 
 * This is an in-memory graph database for the knowledge resolution graph, it's used by
 *  the UI
 */

import { MetaNodeDataType, MetaNodeGenericData, MetaNodeGenericType, MetaNodePromptType, MetaNodeResolveType } from "@/spec/metanode"
import * as dict from '@/utils/dict'

export default class KRG {
  private dataNodes: Record<string, MetaNodeDataType> = {}
  private resolveNodes: Record<string, MetaNodeResolveType> = {}
  private promptNodes: Record<string, MetaNodePromptType> = {}
  private processNodes: Record<string, MetaNodePromptType | MetaNodeResolveType> = {}
  private processForInput: Record<string, Record<string, MetaNodePromptType | MetaNodeResolveType>> = {}
  private processForOutput: Record<string, Record<string, MetaNodePromptType | MetaNodeResolveType>> = {}

  constructor() {}

  getDataNode = (spec: string) => {
    return this.dataNodes[spec]
  }
  getDataNodes = () => {
    return dict.values(this.dataNodes)
  }
  getProcessNode = (spec: string) => {
    return this.processNodes[spec]
  }
  getProcessNodes = () => {
    return dict.values(this.processNodes)
  }
  getResolveNode = (spec: string) => {
    return this.resolveNodes[spec]
  }
  getResolveNodes = () => {
    return dict.values(this.resolveNodes)
  }
  getPromptNode = (spec: string) => {
    return this.promptNodes[spec]
  }
  getPromptNodes = () => {
    return dict.values(this.promptNodes)
  }
  getNextProcess = (spec: string = '') => {
    return dict.values(this.processForInput[spec] || {})
  }

  add = <T extends MetaNodeDataType | MetaNodePromptType | MetaNodeResolveType = MetaNodeGenericType>(node: T) => {
    if (node.kind === 'data') {
      if (node.spec in this.dataNodes) {
        if (this.dataNodes[node.spec] === node) {
          return
        } else {
          this.rm(node.spec)
        }
      }
      this.dataNodes[node.spec] = node
    } else if (node.kind === 'process') {
      if (node.spec in this.processNodes) {
        if (this.processNodes[node.spec] === node) {
          return
        } else {
          this.rm(node.spec)
        }
      }
      if ('prompt' in node) {
        this.promptNodes[node.spec] = node
      } else if ('resolve' in node) {
        this.resolveNodes[node.spec] = node
      }
      this.processNodes[node.spec] = node
      for (const arg in node.inputs) {
        const input = node.inputs[arg] as MetaNodeGenericData
        if (!(input.spec in this.processForInput)) {
          this.processForInput[input.spec] = {}
        }
        this.processForInput[input.spec][node.spec] = node
      }
      if (Object.keys(node.inputs).length === 0) {
        if (!('' in this.processForInput)) {
          this.processForInput[''] = {}
        }
        this.processForInput[''][node.spec] = node
      }
      if (!(node.output.spec in this.processForOutput)) {
        this.processForOutput[node.output.spec] = {}
      }
      this.processForOutput[node.output.spec][node.spec] = node
    }
  }

  /**
   * Remove a node from the KRG, pruning connections accordingly
   */
  rm = (spec: string) => {
    const dataNode = this.getDataNode(spec)
    if (dataNode) {
      delete this.dataNodes[spec]
      if (spec in this.processForInput) {
        delete this.processForInput[spec]
      }
      if (spec in this.processForOutput) {
        delete this.processForOutput[spec]
      }
    } else {
      const processNode = this.getProcessNode(spec)
      if (processNode) {
        if ('prompt' in processNode) {
          delete this.promptNodes[spec]
        } else if ('resolve' in processNode) {
          delete this.resolveNodes[spec]
        }
        delete this.processNodes[spec]
        if ('' in this.processForInput) {
          if (spec in this.processForInput['']) {
            delete this.processForInput[''][spec]
          }
        }
        for (const arg in processNode.inputs) {
          const processNodeInput = processNode.inputs[arg]
          if (processNodeInput.spec in this.processForInput) {
            if (spec in this.processForInput[processNodeInput.spec]) {
              delete this.processForInput[processNodeInput.spec][spec]
              if (Object.keys(this.processForInput[processNodeInput.spec]).length === 0) {
                delete this.processForInput[processNodeInput.spec]
              }
            }
          }
        }
        const processNodeOutput = processNode.output
        if (processNodeOutput.spec in this.processForOutput) {
          if (spec in this.processForOutput[processNodeOutput.spec]) {
            delete this.processForOutput[processNodeOutput.spec][spec]
            if (Object.keys(this.processForOutput[processNodeOutput.spec]).length === 0) {
              delete this.processForOutput[processNodeOutput.spec]
            }
          }
        }
      }
    }
  }
}
