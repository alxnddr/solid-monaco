import { createSignal, createEffect, onCleanup, JSX, onMount, mergeProps, on } from 'solid-js'
import * as monacoEditor from 'monaco-editor'
import loader, { Monaco } from '@monaco-editor/loader'
import { Loader } from './Loader'
import { MonacoContainer } from './MonacoContainer'
import { getOrCreateModel } from './utils'
import { LoaderParams } from './types'

const viewStates = new Map()

export interface MonacoDiffEditorProps {
  original?: string
  modified?: string

  originalLanguage?: string
  modifiedLanguage?: string

  originalPath?: string
  modifiedPath?: string

  loadingState?: JSX.Element
  class?: string
  theme?: monacoEditor.editor.BuiltinTheme | string
  overrideServices?: monacoEditor.editor.IEditorOverrideServices
  width?: string
  height?: string
  options?: monacoEditor.editor.IStandaloneEditorConstructionOptions
  saveViewState?: boolean
  loaderParams?: LoaderParams
  onChange?: (value: string) => void
  onMount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneDiffEditor) => void
  onBeforeUnmount?: (monaco: Monaco, editor: monacoEditor.editor.IStandaloneDiffEditor) => void
}

export const MonacoDiffEditor = (inputProps: MonacoDiffEditorProps) => {
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
  const [editor, setEditor] = createSignal<monacoEditor.editor.IStandaloneDiffEditor>()

  let abortInitialization: (() => void) | undefined
  let monacoOnChangeSubscription: any
  let isOnChangeSuppressed = false

  onMount(async () => {
    loader.config(inputProps.loaderParams ?? { monaco: monacoEditor })
    const loadMonaco = loader.init()

    abortInitialization = () => loadMonaco.cancel()

    try {
      const monaco = await loadMonaco
      const editor = createEditor(monaco)
      setMonaco(monaco)
      setEditor(editor)
      props.onMount?.(monaco, editor)

      monacoOnChangeSubscription = editor.onDidUpdateDiff(() => {
        if (!isOnChangeSuppressed) {
          props.onChange?.(editor.getModifiedEditor().getValue())
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

    props.onBeforeUnmount?.(monaco()!, _editor)
    monacoOnChangeSubscription?.dispose()
    _editor.getModel()?.original.dispose()
    _editor.getModel()?.modified.dispose()
    _editor.dispose()
  })

  createEffect(
    on(
      () => props.modified,
      modified => {
        const _editor = editor()?.getModifiedEditor()
        if (!_editor || typeof modified === 'undefined') {
          return
        }

        if (_editor.getOption(monaco()!.editor.EditorOption.readOnly)) {
          _editor.setValue(modified)
          return
        }

        if (modified !== _editor.getValue()) {
          isOnChangeSuppressed = true

          _editor.executeEdits('', [
            {
              range: _editor.getModel()!.getFullModelRange(),
              text: modified,
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
      () => props.original,
      original => {
        const _editor = editor()?.getOriginalEditor()
        if (!_editor || typeof original === 'undefined') {
          return
        }

        if (_editor.getOption(monaco()!.editor.EditorOption.readOnly)) {
          _editor.setValue(original)
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
      () => props.originalLanguage,
      language => {
        const model = editor()?.getModel()
        if (!language || !model) {
          return
        }

        monaco()?.editor.setModelLanguage(model.original, language)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => props.modifiedLanguage,
      language => {
        const model = editor()?.getModel()
        if (!language || !model) {
          return
        }

        monaco()?.editor.setModelLanguage(model.modified, language)
      },
      { defer: true },
    ),
  )

  createEffect(
    on(
      () => [props.originalPath, props.modifiedPath],
      ([originalPath, modifiedPath], prevPaths) => {
        const _monaco = monaco()
        if (!_monaco || !prevPaths) {
          return
        }

        const [prevOriginalPath, prevModifiedPath] = prevPaths

        const currentModels = editor()?.getModel()
        let originalModel = currentModels?.original
        let modifiedModel = currentModels?.modified

        if (prevOriginalPath !== originalPath) {
          if (props.saveViewState && originalPath != null) {
            viewStates.set(prevOriginalPath, editor()?.getOriginalEditor().saveViewState())
          }

          originalModel = getOrCreateModel(
            _monaco,
            props.original ?? '',
            props.originalLanguage,
            originalPath,
          )
        }

        if (prevModifiedPath !== modifiedPath) {
          if (props.saveViewState && prevModifiedPath != null) {
            viewStates.set(prevModifiedPath, editor()?.getModifiedEditor().saveViewState())
          }

          modifiedModel = getOrCreateModel(
            _monaco,
            props.modified ?? '',
            props.modifiedLanguage,
            modifiedPath,
          )
        }

        editor()?.setModel({ modified: modifiedModel!, original: originalModel! })

        if (props.saveViewState) {
          editor()?.getOriginalEditor().restoreViewState(viewStates.get(originalPath))
          editor()?.getModifiedEditor().restoreViewState(viewStates.get(modifiedPath))
        }
      },
      { defer: true },
    ),
  )

  const createEditor = (monaco: Monaco) => {
    const originalModel = getOrCreateModel(
      monaco,
      props.original ?? '',
      props.originalLanguage,
      props.originalPath,
    )
    const modifiedModel = getOrCreateModel(
      monaco,
      props.modified ?? '',
      props.modifiedLanguage,
      props.modifiedPath,
    )

    const editor = monaco.editor.createDiffEditor(
      containerRef,
      {
        automaticLayout: true,
        ...props.options,
      },
      props.overrideServices,
    )

    editor.setModel({
      original: originalModel,
      modified: modifiedModel,
    })

    return editor
  }

  return (
    <MonacoContainer class={props.class} width={props.width} height={props.height}>
      {!editor() && <Loader>{props.loadingState}</Loader>}
      <div style={{ width: '100%' }} ref={containerRef!} />
    </MonacoContainer>
  )
}
