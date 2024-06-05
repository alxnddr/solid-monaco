<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-monaco&background=tiles&project=%20" alt="solid-monaco">
</p>

# solid-monaco

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Monaco Editor for SolidJS

## Quick start

Install it:

```bash
npm i solid-monaco
```
*or*

```bash
yarn add solid-monaco
```
*or*
```bash
pnpm add solid-monaco
```

## MonacoEditor

Basic usage:

You can import and use the `MonacoEditor` component in your Solid application:

```jsx
import { MonacoEditor } from 'solid-monaco';

function MyEditor() {
  return <MonacoEditor language="javascript" value="console.log('Hello World');" />;
}
```

### Props

The `MonacoEditor` component accepts the following props:

| Prop               | Type                                                               | Default      | Description                                                                    |
|--------------------|--------------------------------------------------------------------|--------------|--------------------------------------------------------------------------------|
| `language`         | `string`                                                           | -            | The programming language for the editor. E.g., `"javascript"`, `"typescript"`. |
| `value`            | `string`                                                           | -            | Content of the editor.                                                         |
| `loadingState`     | `JSX.Element`                                                      | `"Loading…"` | JSX element to be displayed during the loading state.                          |
| `class`            | `string`                                                           | -            | CSS class for the editor container.                                            |
| `theme`            | `BuiltinTheme` or `string`                                         | `"vs"`       | The theme to be applied to the editor.                                         |
| `path`             | `string`                                                           | `""`         | Path used for Monaco model management for multiple files.                      |
| `overrideServices` | `object`                                                           | -            | Services to override the default ones provided by Monaco.                      |
| `width`            | `string`                                                           | `"100%"`     | Width of the editor container.                                                 |
| `height`           | `string`                                                           | `"100%"`     | Height of the editor container.                                                |
| `options`          | `object`                                                           | -            | Additional options for the Monaco editor.                                      |
| `saveViewState`    | `string`                                                           | `true`       | Whether to save the model view state for a given path of the editor.           |
| `onChange`         | `(value: string, event: editor.IModelContentChangedEvent) => void` | -            | Callback triggered when the content of the editor changes.                     |
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered when the editor mounts.                                     |
| `onBeforeUnmount`  | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered before the editor unmounts.                                 |

### Getting Monaco and Editor Instances

You can get instances of both `monaco` and the `editor` by using the `onMount` callback:

```jsx
import { MonacoEditor } from 'solid-monaco';

function MyEditor() {
  const handleMount = (monaco, editor) => {
    // Use monaco and editor instances here
  };

  return (
    <MonacoEditor
      language="javascript"
      value="console.log('Hello World');"
      onMount={handleMount}
    />
  );
}
```

## MonacoDiffEditor

For a side-by-side comparison view of code, the package provides a `MonacoDiffEditor` component.

### Basic Usage

You can incorporate the `MonacoDiffEditor` component into your Solid application:

```jsx
import { MonacoDiffEditor } from 'solid-monaco';

function MyDiffEditor() {
  return (
    <MonacoDiffEditor
      original="const foo = 1;"
      modified="const foo = 2;"
      originalLanguage="javascript"
      modifiedLanguage="javascript"
    />
  );
}
```

### Props

The `MonacoDiffEditor` component accepts the following props:

| Prop               | Type                                                             | Default      | Description                                                            |
|--------------------|------------------------------------------------------------------|--------------|------------------------------------------------------------------------|
| `original`         | `string`                                                         | -            | Original content to be displayed on the left side of the diff editor.  |
| `modified`         | `string`                                                         | -            | Modified content to be displayed on the right side of the diff editor. |
| `originalLanguage` | `string`                                                         | -            | Language for the original content.                                     |
| `modifiedLanguage` | `string`                                                         | -            | Language for the modified content.                                     |
| `originalPath`     | `string`                                                         | -            | Path for the original content used in Monaco model management.         |
| `modifiedPath`     | `string`                                                         | -            | Path for the modified content used in Monaco model management.         |
| `loadingState`     | `JSX.Element`                                                    | `"Loading…"` | JSX element displayed during the loading state.                        |
| `class`            | `string`                                                         | -            | CSS class for the diff editor container.                               |
| `theme`            | `BuiltinTheme` or `string`                                       | `"vs"`       | Theme applied to the diff editor.                                      |
| `overrideServices` | `object`                                                         | -            | Services to override the default ones provided by Monaco.              |
| `width`            | `string`                                                         | `"100%"`     | Width of the diff editor container.                                    |
| `height`           | `string`                                                         | `"100%"`     | Height of the diff editor container.                                   |
| `options`          | `object`                                                         | -            | Additional options for the Monaco diff editor.                         |
| `saveViewState`    | `boolean`                                                        | `true`       | Whether to save the model view state.                                  |
| `onChange`         | `(value: string) => void`                                        | -            | Callback triggered when the content of the modified editor changes.    |
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneDiffEditor) => void` | -            | Callback triggered when the diff editor mounts.                        |
| `onBeforeUnmount`  | `(monaco: Monaco, editor: editor.IStandaloneDiffEditor) => void` | -            | Callback triggered before the diff editor unmounts.                    |

## Contributing

Contributions to `solid-monaco` are welcomed!

## Acknowledgments

- [monaco-editor](https://github.com/microsoft/monaco-editor): The core editor that this package wraps for Solid.js.
- [monaco-react](https://github.com/suren-atoyan/monaco-react) by [Suren Atoyan](https://github.com/suren-atoyan): A
  package referred to during the development of the solid-monaco wrapper.

## License

MIT
