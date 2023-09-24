import { createSignal, createEffect, onCleanup, JSX, onMount, mergeProps, on } from 'solid-js'
import { editor as monacoEditor } from 'monaco-editor'
import loader, { Monaco } from '@monaco-editor/loader'
import { Loader } from './Loader'
import { MonacoContainer } from './MonacoContainer'

const viewStates = new Map()

export interface MonacoEditorProps {
  language?: string
  value?: string
  loadingState?: JSX.Element
  class?: string
  theme?: monacoEditor.BuiltinTheme | string
  path?: string
  overrideServices?: monacoEditor.IEditorOverrideServices
  width?: string
  height?: string
  options?: monacoEditor.IStandaloneEditorConstructionOptions
  saveViewState?: string
  onChange?: (value: string, event: monacoEditor.IModelContentChangedEvent) => void
  onMount?: (monaco: Monaco, editor: monacoEditor.IStandaloneCodeEditor) => void
}

export const MonacoEditor = (inputProps: MonacoEditorProps) => {
  const props = mergeProps(
    {
      theme: 'vs',
      width: '100%',
      height: '100%',
      loadingState: 'Loading…',
      path: '',
      saveViewState: true,
    },
    inputProps,
  )

  let containerRef: HTMLDivElement

  const [monaco, setMonaco] = createSignal<Monaco>()
  const [editor, setEditor] = createSignal<monacoEditor.IStandaloneCodeEditor>()

  let abortInitialization: (() => void) | undefined
  let monacoOnChangeSubscription: any
  let isOnChangeSuppressed = false

  onMount(async () => {
    const loadMonaco = loader.init()

    abortInitialization = () => loadMonaco.cancel()

    try {
      const monaco = await loadMonaco
      const editor = createEditor(monaco)
      setMonaco(monaco)
      setEditor(editor)
      props.onMount?.(monaco, editor)

      monacoOnChangeSubscription = editor.onDidChangeModelContent(event => {
        if (!isOnChangeSuppressed) {
          props.onChange?.(editor.getValue(), event)
        }
      })
    } catch (error: any) {
      if (error?.type === 'cancelation') {
        return
      }

      console.error('Could not initialize Monaco', error)
    }
  })

  onCleanup(() => {
    const _editor = editor()
    if (!_editor) {
      abortInitialization?.()
      return
    }

    monacoOnChangeSubscription?.dispose()
    _editor.getModel()?.dispose()
    _editor.dispose()
  })

  createEffect(
    on(
      () => props.value,
      value => {
        const _editor = editor()
        if (!_editor || typeof value === 'undefined') {
          return
        }

        if (_editor.getOption(monaco()!.editor.EditorOption.readOnly)) {
          _editor.setValue(value)
          return
        }

        if (value !== _editor.getValue()) {
          isOnChangeSuppressed = true

          _editor.executeEdits('', [
            {
              range: _editor.getModel()!.getFullModelRange(),
              text: value,
              forceMoveMarkers: true,
            },
          ])

          _editor.pushUndoStop()
          isOnChangeSuppressed = false
        }
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.options,
      options => {
        editor()?.updateOptions(options ?? {})
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.theme,
      theme => {
        monaco()?.editor.setTheme(theme)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.language,
      language => {
        const model = editor()?.getModel()
        if (!language || !model) {
          return
        }

        monaco()?.editor.setModelLanguage(model, language)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.path,
      (path, prevPath) => {
        const _monaco = monaco()
        if (!_monaco) {
          return
        }

        const model = getOrCreateModel(_monaco, path, props.value ?? '', props.language)

        if (model !== editor()?.getModel()) {
          if (props.saveViewState) {
            viewStates.set(prevPath, editor()?.saveViewState())
          }
          editor()?.setModel(model)
          if (props.saveViewState) {
            editor()?.restoreViewState(viewStates.get(path))
          }
        }
      },
      { defer: true },
    ),
  )

  const getOrCreateModel = (monaco: Monaco, path: string, value: string, language?: string) => {
    const pathUri = monaco.Uri.parse(path)
    const existingModel = monaco.editor.getModel(pathUri)

    if (existingModel) {
      return existingModel
    }

    return monaco.editor.createModel(value, language, monaco.Uri.parse(path))
  }

  const createEditor = (monaco: Monaco) => {
    const model = getOrCreateModel(monaco, props.path, props.value ?? '', props.language)

    return monaco.editor.create(
      containerRef,
      {
        model: model,
        automaticLayout: true,
        ...props.options,
      },
      props.overrideServices,
    )
  }

  return (
    <MonacoContainer class={props.class} width={props.width} height={props.height}>
      {!editor() && <Loader>{props.loadingState}</Loader>}
      <div style={{ width: '100%' }} ref={containerRef!} />
    </MonacoContainer>
  )
}
