import { createRoot } from 'solid-js'
import { describe, expect, it } from 'vitest'
import { MonacoDiffEditor } from '../src'

// TODO: add real tests
describe('MonacoDiffEditor', () => {
  it('renders a MonacoDiffEditor component', async () => {
    createRoot(() => {
      const container = (<MonacoDiffEditor />) as HTMLDivElement
      expect(container.outerHTML).toMatchSnapshot()
    })
  })
})
