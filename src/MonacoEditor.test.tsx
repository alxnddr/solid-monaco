import { createRoot } from 'solid-js'
import { describe, expect, it } from 'vitest'
import { MonacoEditor } from '../src'

describe('MonacoEditor', () => {
  it('renders a MonacoEditor component', async () => {
    createRoot(() => {
      const container = (<MonacoEditor />) as HTMLDivElement
      expect(container.outerHTML).toMatchSnapshot()
    })
  })
})
