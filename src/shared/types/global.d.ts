declare module 'global' {
  export type AnyObject = { [key: string]: any }
  export type EmptyObject = { [key: string]: never }
}
