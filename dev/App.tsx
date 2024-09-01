import type { Component, ParentComponent } from 'solid-js'
import styles from './App.module.css'
import { MonacoPlayground } from './MonacoPlayground'
import { MonacoDiffPlayground } from './MonacoDiffPlayground'
import { A, Route, Router } from '@solidjs/router'

const Wrapper: ParentComponent = props => {
  return (
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
      <div class={styles.editorContainer}>{props.children}</div>
    </div>
  )
}

const App: Component = () => {
  return (
    <Router root={Wrapper}>
      <Route path="/" component={MonacoPlayground} />
      <Route path="/diff" component={MonacoDiffPlayground} />
    </Router>
  )
}

export default App
