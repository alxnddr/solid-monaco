import { createSignal, createEffect, onCleanup, JSX, onMount, mergeProps, on } from 'solid-js'
import type * as monacoEditor from 'monaco-editor'
import loader, { Monaco } from '@monaco-editor/loader'
import { Loader } from './Loader'
import { MonacoContainer } from './MonacoContainer'
import { getOrCreateModel } from './utils'
import { LoaderParams } from './types'

const viewStates = new Map()

export interface MonacoEditorProps {
  language?: string
  value?: string
  line?: number
  loadingState?: JSX.Element
  class?: string
  theme?: monacoEditor.editor.BuiltinTheme | string
  path?: string
  overrideServices?: monacoEditor.editor.IEditorOverrideServices
  width?: string
  height?: string
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions
  saveViewState?: boolean
  loaderParams?: LoaderParams
  onChange?: (value: string, event: monacoEditor.editor.IModelContentChangedEvent) => void
  onBeforeMount?: (monaco: Monaco) => void
  onMount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneCodeEditor) => void
  onBeforeUnmount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneCodeEditor) => void
  onValidate?: (markers: monacoEditor.editor.IMarker[]) => void
}

export const MonacoEditor = (inputProps: MonacoEditorProps) => {
  const props = mergeProps(
    {
      theme: 'vs',
      width: '100%',
      height: '100%',
      loadingState: 'Loading…',
      saveViewState: true,
    },
    inputProps,
  )

  let containerRef: HTMLDivElement

  const [monaco, setMonaco] = createSignal<Monaco>()
  const [editor, setEditor] = createSignal<monacoEditor.editor.IStandaloneCodeEditor>()

  let abortInitialization: (() => void) | undefined
  let monacoOnChangeSubscription: any
  let validationSubscription: monacoEditor.IDisposable | undefined
  let isOnChangeSuppressed = false

  onMount(async () => {
    loader.config(inputProps.loaderParams ?? {
      paths: {
        vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.48.0/min/vs'
      }
    })
    const loadMonaco = loader.init()

    abortInitialization = () => loadMonaco.cancel()

    try {
      const monaco = await loadMonaco
      
      // Call beforeMount callback before editor creation
      props.onBeforeMount?.(monaco)
      
      const editor = createEditor(monaco)
      setMonaco(monaco)
      setEditor(editor)
      
      // Handle initial line positioning
      if (props.line !== undefined) {
        editor.revealLine(props.line)
      }
      
      props.onMount?.(monaco, editor)

      monacoOnChangeSubscription = editor.onDidChangeModelContent((event: monacoEditor.editor.IModelContentChangedEvent) => {
        if (!isOnChangeSuppressed) {
          props.onChange?.(editor.getValue(), event)
        }
      })

      // Setup validation subscription if onValidate is provided
      if (props.onValidate) {
        validationSubscription = monaco.editor.onDidChangeMarkers((uris: readonly monacoEditor.Uri[]) => {
          const editorUri = editor.getModel()?.uri
          if (editorUri) {
            const currentEditorHasMarkerChanges = uris.find((uri: monacoEditor.Uri) => uri.path === editorUri.path)
            if (currentEditorHasMarkerChanges) {
              const markers = monaco.editor.getModelMarkers({ resource: editorUri })
              props.onValidate!(markers)
            }
          }
        })
      }
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

    props.onBeforeUnmount?.(monaco()!, _editor)
    monacoOnChangeSubscription?.dispose()
    validationSubscription?.dispose()
    _editor.getModel()?.dispose()
    _editor.dispose()
  })

  createEffect(
    on(
      () => props.value,
      (value: string | undefined) => {
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
      (options: monacoEditor.editor.IStandaloneEditorConstructionOptions | undefined) => {
        editor()?.updateOptions(options ?? {})
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.theme,
      (theme: monacoEditor.editor.BuiltinTheme | string) => {
        monaco()?.editor.setTheme(theme)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.language,
      (language: string | undefined) => {
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
      (path: string | undefined, prevPath: string | undefined) => {
        const _monaco = monaco()
        if (!_monaco) {
          return
        }

        const model = getOrCreateModel(_monaco, props.value ?? '', props.language, path)

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

  createEffect(
    on(
      () => props.line,
      (line: number | undefined) => {
        const currentEditor = editor()
        if (line !== undefined && currentEditor) {
          currentEditor.revealLine(line)
        }
      },
      { defer: true },
    ),
  )

  const createEditor = (monaco: Monaco) => {    
    const model = getOrCreateModel(monaco, props.value ?? '', props.language, props.path)

    return monaco.editor.create(
      containerRef!,
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
