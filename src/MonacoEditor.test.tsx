import { createRoot } from 'solid-js'
import { describe, expect, it } from 'vitest'
import { MonacoEditor } from '../src'

// TODO: add real tests
describe('MonacoEditor', () => {
  it('renders a MonacoEditor component', async () => {
    createRoot(() => {
      const container = (<MonacoEditor />) as HTMLDivElement
      expect(container.outerHTML).toMatchSnapshot()
    })
  })
})
