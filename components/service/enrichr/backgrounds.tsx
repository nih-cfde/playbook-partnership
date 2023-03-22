import * as dict from '@/utils/dict'

export const Disease_backgrounds = [
  {
    name: 'Disease_Signatures_from_GEO_down_2014',
    label: 'Disease Signatures from GEO down',
    termType: 'Disease',
    termRe: /^(?<term>.+) (?<gse>[^ ]+)$/,
    termLabel: 'GEO Disease Signatures',
    termAssociation: 'Containing',
    ref: 'http://www.ncbi.nlm.nih.gov/geo/',
  },
  {
    name: 'Disease_Signatures_from_GEO_up_2014',
    label: 'Disease Signatures from GEO up',
    termType: 'Disease',
    termRe: /^(?<term>.+) (?<gse>[^ ]+)$/,
    termLabel: 'GEO Disease Signatures',
    termAssociation: 'Containing',
    ref: 'http://www.ncbi.nlm.nih.gov/geo/',
  },
  {
    name: 'GTEx_Aging_Signatures_2021',
    label: 'GTEx Aging Signatures 2021',
    termType: 'Disease',
    termRe: /^GTEx (?<term>.+)$/,
    termLabel: 'GeneRIF Rare Diseases',
    termAssociation: 'Containing',
    ref: 'https://gtexportal.org/',
  },
  {
    name: 'Rare_Diseases_GeneRIF_ARCHS4_Predictions',
    label: 'Rare Diseases GeneRIF ARCHS4 Predictions',
    termType: 'Disease',
    termRe: /^(?<term>.+)$/,
    termLabel: 'GeneRIF Rare Diseases',
    termAssociation: 'Containing',
    ref: 'https://www.ncbi.nlm.nih.gov/gene/about-generif',
  },
  {
    name: 'Rare_Diseases_GeneRIF_Gene_Lists',
    label: 'Rare Diseases GeneRIF Gene Lists',
    termType: 'Disease',
    termRe: /^(?<term>.+)$/,
    termLabel: 'GeneRIF Rare Diseases',
    termAssociation: 'Containing',
    ref: 'https://www.ncbi.nlm.nih.gov/gene/about-generif',
  },
]

export const Drug_backgrounds = [
  {
    name: 'LINCS_L1000_Chem_Pert_Consensus_Sigs',
    label: 'LINCS L1000 Chem Pert Consensus Sigs',
    termType: 'Drug',
    termRe: /^(?<term>.+) (?<direction>Up|Down)$/,
    termLabel: 'L1000 Chem Pert Signatures',
    termAssociation: 'Containing',
    ref: 'https://maayanlab.cloud/sigcom-lincs/#/Download',
  },
  {
    name: 'LINCS_L1000_Chem_Pert_up',
    label: 'LINCS L1000 Chem Pert Up',
    termType: 'Drug',
    termRe: /^(?<desc>.+?-(?<term>.+)-(?<concentration>.+?))$/,
    termLabel: 'L1000 Chem Pert Signatures',
    termAssociation: 'Containing',
    ref: 'https://clue.io/',
  },
  {
    name: 'LINCS_L1000_Chem_Pert_down',
    label: 'LINCS L1000 Chem Pert Down',
    termType: 'Drug',
    termRe: /^(?<desc>.+?-(?<term>.+)-(?<concentration>.+?))$/,
    termLabel: 'L1000 Chem Pert Signatures',
    termAssociation: 'Containing',
    ref: 'https://clue.io/',
  },
]

export const Pathway_backgrounds = [
  {
    name: 'GO_Biological_Process_2021',
    label: 'GO Biological Process 2021',
    termType: 'BiologicalProcess',
    termRe: /^(?<term>.+)\((?<xref>.+?)\)$/,
    termLabel: 'GO Biological Processes',
    termAssociation: 'Containing',
    ref: 'http://www.geneontology.org/',
  },
  {
    name: 'KEGG_2019_Human',
    label: 'KEGG 2019 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'KEGG Pathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.kegg.jp/',
  },
  {
    name: 'KEGG_2019_Mouse',
    label: 'KEGG 2019 Mouse',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'KEGG Pathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'mouse',
    },
    ref: 'https://www.kegg.jp/',
  },
  {
    name: 'KEGG_2021_Human',
    label: 'KEGG 2021 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'KEGG Pathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.kegg.jp/',
  },
  {
    name: 'MSigDB_Hallmark_2020',
    label: 'MSigDB Hallmark 2020',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'MSigDB Hallmark Gene Sets',
    termAssociation: 'Containing',
    ref: 'https://www.gsea-msigdb.org/gsea/msigdb/collections.jsp',
  },
  {
    name: 'WikiPathway_2021_Human',
    label: 'WikiPathway 2021 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'WikiPathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.wikipathways.org/',
  },
  {
    name: 'WikiPathways_2019_Human',
    label: 'WikiPathways 2019 Human',
    termType: 'Pathway',
    termRe: /^(?<term>.+) (?<id>[^ ]+)$/,
    termLabel: 'WikiPathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.wikipathways.org/',
  },
  {
    name: 'WikiPathways_2019_Mouse',
    label: 'WikiPathways 2019 Mouse',
    termType: 'Pathway',
    termRe: /^(?<term>.+)$/,
    termLabel: 'WikiPathways',
    termAssociation: 'Containing',
    extra: {
      organism: 'mouse',
    },
    ref: 'https://www.wikipathways.org/',
  },
]

export const Phenotype_backgrounds = [
  {
    name: 'GWAS_Catalog_2019',
    label: 'GWAS Catalog 2019',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    termLabel: 'GWAS Phenotypes',
    termAssociation: 'Associated with',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.ebi.ac.uk/gwas',
  },
  {
    name: 'UK_Biobank_GWAS_v1',
    label: 'UK Biobank GWAS v1',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    termLabel: 'UK Biobank Phenotypes',
    termAssociation: 'Associated with',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.ukbiobank.ac.uk/tag/gwas/',
  },
  {
    name: 'ClinVar_2019',
    label: 'ClinVar 2019',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    termLabel: 'ClinVar Phenotypes',
    termAssociation: 'Associated with',
    extra: {
      organism: 'human',
    },
    ref: 'https://www.ncbi.nlm.nih.gov/clinvar/',
  },
  {
    name: 'Human_Phenotype_Ontology',
    label: 'Human Phenotype Ontology',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    termLabel: 'Human Phenotypes',
    termAssociation: 'Associated with',
    extra: {
      organism: 'human',
    },
    ref: 'http://www.human-phenotype-ontology.org/',
  },
  {
    name: 'MGI_Mammalian_Phenotype_Level_4_2019',
    label: 'MGI Mammalian Phenotype Level 4 2019',
    termType: 'Phenotype',
    termRe: /^(?<term>.+)$/,
    termLabel: 'MGI Mammalian Phenotypes',
    termAssociation: 'Associated with',
    extra: {
      organism: 'mouse',
    },
    ref: 'http://www.informatics.jax.org/',
  },
]

export const Tissue_backgrounds = [
  {
    name: 'GTEx_Tissues_V8_2023',
    label: 'GTEx Tissues V8 2023',
    termType: 'Tissue',
    termRe: /^(?<term>.+) (?<gender>[^ ]+) (?<age>[^ ]+) (?<direction>[^ ]+)$/,
    termLabel: 'GTEx Tissue Signatures',
    termAssociation: 'Containing',
    extra: {
      organism: 'human',
    },
    ref: 'https://gtexportal.org/home/',
  },
  {
    name: 'ARCHS4_Tissues',
    label: 'ARCHS4 Tissues',
    termType: 'Tissue',
    termRe: /^(?<term>.+)$/,
    termLabel: 'ARCHS4 Tissue Signatures',
    termAssociation: 'Containing',
    ref: 'https://maayanlab.cloud/archs4/',
  },
]

export const Gene_backgrounds = [
  {
    name: 'ChEA_2022',
    label: 'ChEA 2022',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+?) (?<origin>.+) (?<organism>[^ ]+)$/,
    termLabel: 'ChEA Transcription Factors',
    termAssociation: 'Targeting',
    ref: 'https://maayanlab.cloud/chea3/',
  },
  {
    name: 'ENCODE_TF_ChIP-seq_2015',
    label: 'ENCODE TF ChIP-seq 2015',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+) (?<origin>.+) (?<organism>[^ ]+)$/,
    termLabel: 'ENCODE Transcription Factors',
    termAssociation: 'Targeting',
    ref: 'http://genome.ucsc.edu/ENCODE/downloads.html',
  },
  {
    name: 'ARCHS4_TFs_Coexp',
    label: 'ARCHS4 TF Co-Expression',
    termType: 'TranscriptionFactor',
    termRe: /^(?<term>[^ ]+) (?<organism>[^ ]+) (?<origin>.+)$/,
    termLabel: 'ARCHS4 Transcription Factors',
    termAssociation: 'Correlated with',
    ref: 'https://maayanlab.cloud/archs4/',
  },
  {
    name: 'LINCS_L1000_CRISPR_KO_Consensus_Sigs',
    label: 'LINCS L1000 CRISPR KO Consensus Sigs',
    termType: 'Gene',
    termRe: /^(?<term>.+) (?<direction>.+)$/,
    termLabel: 'L1000 CRISPR KO Signatures',
    termAssociation: 'Containing',
    ref: 'https://maayanlab.cloud/sigcom-lincs/#/Download',
  },
]

export const backgrounds = dict.init([
  ...Disease_backgrounds,
  ...Drug_backgrounds,
  ...Pathway_backgrounds,
  ...Phenotype_backgrounds,
  ...Tissue_backgrounds,
  ...Gene_backgrounds,
].map((value) => ({ key: value.name, value })))
