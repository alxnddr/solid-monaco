import type { Component } from 'solid-js'
import styles from './App.module.css'
import { MonacoPlayground } from './MonacoPlayground'
import { MonacoDiffPlayground } from './MonacoDiffPlayground'
import { A, Route, Router, Routes } from '@solidjs/router'

const App: Component = () => {
  return (
    <Router>
      <div class={styles.root}>
        <div class={styles.header}>
          solid-monaco playground
          <div class={styles.nav}>
            <A href="/" class={styles.navItem} activeClass={styles.navItemActive} end>
              Editor
            </A>
            <A href="/diff" class={styles.navItem} activeClass={styles.navItemActive} end>
              Diff Editor
            </A>
          </div>
        </div>
        <div class={styles.editorContainer}>
          <Routes>
            <Route path="/" component={MonacoPlayground} />
            <Route path="/diff" component={MonacoDiffPlayground} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
