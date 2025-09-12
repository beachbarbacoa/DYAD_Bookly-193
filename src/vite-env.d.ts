/// <reference types="vite/client" />
/// <reference types="react/next" />
/// <reference types="react-dom/next" />

declare module '*.tsx' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
}