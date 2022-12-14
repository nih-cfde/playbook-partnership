/**
 * A lightweight "ORM" for constructing type-safe pg tables, useful so
 *  we can define the .sql and the typescript model at the same time.
 **/
import { z } from "zod"
import * as dict from '@/utils/dict'
import { Codec, Decoded, Encoded } from "./codec"

const identityZodCodec = <T>(z: z.ZodType<T>): Codec<T, T> => ({ encode: z.parse, decode: z.parse })

const ObjectCodec = <T>(field_codecs: {[K in keyof T]: Codec<Decoded<T[K]>, Encoded<T[K]>>}) => ({
  encode: (data: { [K in keyof T]: Decoded<T[K]> }) =>
    dict.init(dict.items(data).map(({ key, value }) => ({ key, value: field_codecs[key as keyof T].encode(value as any) }))) as { [K in keyof T]: Encoded<T[K]> },
  decode: (data: { [K in keyof T]: Encoded<T[K]> }) =>
    dict.init(dict.items(data).map(({ key, value }) => ({ key, value: field_codecs[key as keyof T].decode(value as any) }))) as { [K in keyof T]: Decoded<T[K]> },
})

export type TypedSchema<T = {}> = {
  name: string
  codec: Codec<{[K in keyof T]: Decoded<T[K]>}, {[K in keyof T]: Encoded<T[K]>}>
  field_codecs: {[K in keyof T]: Codec<Decoded<T[K]>, Encoded<T[K]>>}
  field_sql: {[K in keyof T]: string}
  extra_insert_sql?: string,
  schema_up: string
  schema_down: string
}

export type TableSchema<T = {}> = {
  name: string
  field_codecs: {[K in keyof T]: Codec<Decoded<T[K]>, Encoded<T[K]>>}
  field_sql: {[K in keyof T]: string}
  field_extra_sql: {[K in keyof T]: string}
  extra_sql: string[]
  extra_insert_sql: string,
}

/**
 * Usage:
 * const table_name = Table.createTable('table_name')
 *   // fieldname, pg schema, and a codec to determine how it should be treated in and out of the db
 *   .field('fieldname', 'varchar', { encode: z.string().transform(s => s|0).parse, decode: z.int().transform(i => i+'').parse }) 
 *   // in the case of storing it equally both ways, a zod schema can be used
 *   .field('fieldname', 'varchar', z.string())
 *   .extra('') // any extra sql in the table definition like primary key/constraints
 *   .build()
 */
export class Table<T = {}> {
  constructor(public t: TableSchema<T>) {}
  static create(name: string) {
    return new Table({ name, field_codecs: {}, field_sql: {}, field_extra_sql: {}, extra_sql: [], extra_insert_sql: '' })
  }
  field<S extends string, D, E = D>(name: S, sql: string, extra_sql: string, type: z.ZodType<D> | Codec<D, E>) {
    return new Table({
      ...this.t,
      field_codecs: { ...this.t.field_codecs, [name]: 'parse' in type ? identityZodCodec(type): type },
      field_sql: { ...this.t.field_sql, [name]: sql },
      field_extra_sql: { ...this.t.field_extra_sql, [name]: extra_sql },
    } as TableSchema<T & { [K in S]: Codec<D, E> }>)
  }
  extra(extra_sql: string) {
    return new Table({
      ...this.t,
      extra_sql: [...this.t.extra_sql, extra_sql],
    })
  }
  extra_insert(extra_insert_sql: string) {
    return new Table({
      ...this.t,
      extra_insert_sql,
    })
  }
  build() {
    const { name, field_codecs, field_sql, extra_insert_sql, field_extra_sql } = this.t
    const codec = ObjectCodec(field_codecs)
    const schema_up = [
      `create table ${JSON.stringify(this.t.name)} (`,
      [
        ...dict.keys(field_sql).map(field =>
          `  ${JSON.stringify(field)} ${field_sql[field]} ${field_extra_sql[field]}`
        ),
        ...this.t.extra_sql.map(sql => `  ${sql}`),
      ].join(',\n'),
      `);`,
    ].join('\n')
    
    const schema_down = `drop table ${JSON.stringify(this.t.name)};`
    return { codec, name, field_sql, field_codecs, extra_insert_sql, schema_up, schema_down } as TypedSchema<T>
  }
}

export type ViewSchema<T = {}> = {
  name: string
  field_codecs: {[K in keyof T]: Codec<Decoded<T[K]>, Encoded<T[K]>>}
  sql: string
}

export class View<T extends {} = {}> {
  constructor(public t: ViewSchema<T>) {}
  static create(name: string) {
    return new View({ name, field_codecs: {}, sql: '' })
  }
  field<S extends string, D, E = D>(name: S, type: z.ZodType<D> | Codec<D, E>) {
    return new View({
      ...this.t,
      field_codecs: { ...this.t.field_codecs, [name]: 'parse' in type ? identityZodCodec(type): type },
    } as ViewSchema<T & { [K in S]: Codec<D, E> }>)
  }
  sql(...sql: string[]) {
    return new View({ ...this.t, sql: sql.join('\n'), })
  }
  build() {
    const { name, field_codecs } = this.t
    const codec = ObjectCodec(field_codecs)
    const schema_up = `create view ${JSON.stringify(this.t.name)} as ${this.t.sql}`
    const schema_down = `drop view ${JSON.stringify(this.t.name)};`
    return { codec, name, field_codecs, schema_up, schema_down } as TypedSchema<T>
  }
}


export type SQLSchema = {
  schema_up: string
  schema_down: string
}

export class SQL {
  constructor(public t: SQLSchema) {}
  static create() {
    return new SQL({ schema_up: '', schema_down: '' })
  }
  up(...sql: string[]) {
    return new SQL({ ...this.t, schema_up: sql.join('\n'), })
  }
  down(...sql: string[]) {
    return new SQL({ ...this.t, schema_down: sql.join('\n'), })
  }
  build() {
    const { schema_up, schema_down } = this.t
    return { schema_up, schema_down }
  }
}
