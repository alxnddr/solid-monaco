import { createSignal, JSX } from 'solid-js'
import { MonacoDiffEditor } from '../src'

import styles from './MonacoPlayground.module.css'
import { exampleData } from './example-data'

const builtinThemes = ['vs', 'vs-dark', 'hc-light', 'hc-black'] as const

export const MonacoDiffPlayground = () => {
  const [theme, setTheme] = createSignal<string>(builtinThemes[0])
  const [modified, setModified] = createSignal<string>(exampleData[0].content)
  const [original, setOriginal] = createSignal<string>(exampleData[0].content)
  const [language, setLanguage] = createSignal<string>(exampleData[0].language)

  const handleThemeChange: JSX.EventHandler<HTMLSelectElement, Event> = e => {
    setTheme(e.currentTarget.value)
  }

  const handleLanguageChange: JSX.EventHandler<HTMLSelectElement, Event> = e => {
    const sampleContent = exampleData.find(data => data.language === e.currentTarget.value)
    if (!sampleContent) {
      return
    }

    setLanguage(sampleContent.language)
    setModified(sampleContent.content)
    setOriginal(sampleContent.content)
  }

  return (
    <div class={styles.root}>
      <div class={styles.settings}>
        <select name="theme" onChange={handleThemeChange}>
          {builtinThemes.map(theme => (
            <option value={theme}>{theme}</option>
          ))}
        </select>

        <select name="language" onChange={handleLanguageChange}>
          {exampleData.map(data => (
            <option value={data.language}>{data.language}</option>
          ))}
        </select>
      </div>
      <MonacoDiffEditor
        options={{ padding: { top: 24 } }}
        originalLanguage={language()}
        modifiedLanguage={language()}
        theme={theme()}
        onChange={setModified}
        modified={modified()}
        original={original()}
      />
    </div>
  )
}
