import type { Component } from 'solid-js'
import styles from './App.module.css'
import { MonacoPlayground } from './MonacoPlayground'

const App: Component = () => {
  return (
    <div class={styles.root}>
      <div class={styles.header}>solid-monaco playground</div>
      <div class={styles.editorContainer}>
        <MonacoPlayground />
      </div>
    </div>
  )
}

export default App
