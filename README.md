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
# or
yarn add solid-monaco
# or
pnpm add solid-monaco
```

Basic usage:

You can import and use the `MonacoEditor` component in your Solid application:

```jsx
import { MonacoEditor } from 'solid-monaco';

function MyEditor() {
  return <MonacoEditor language="javascript" value="console.log('Hello World');" />;
}
```

## Props

The `MonacoEditor` component accepts the following props:

| Prop               | Type                                                               | Default      | Description                                                                    |
|--------------------|--------------------------------------------------------------------|--------------|--------------------------------------------------------------------------------|
| `language`         | `string`                                                           | -            | The programming language for the editor. E.g., `"javascript"`, `"typescript"`. |
| `value`            | `string`                                                           | -            | Content of the editor.                                                         |
| `loadingState`     | `JSX.Element`                                                      | `"Loading…"` | JSX element to be displayed during the loading state.                          |
| `class`            | `string`                                                           | -            | CSS class for the editor container.                                            |
| `theme`            | `BuiltinTheme` or `string`                                         | `"vs"`       | The theme to be applied to the editor.                                         |
| `path`             | `string`                                                           | `""`         | Path used for Monaco model management for multiple files.                      |
| `overrideServices` | `editor.IEditorOverrideServices`                                   | -            | Services to override the default ones provided by Monaco.                      |
| `width`            | `string`                                                           | `"100%"`     | Width of the editor container.                                                 |
| `height`           | `string`                                                           | `"100%"`     | Height of the editor container.                                                |
| `options`          | `editor.IStandaloneEditorConstructionOptions`                      | -            | Additional options for the Monaco editor.                                      |
| `saveViewState`    | `string`                                                           | `true`       | Whether to save the model view state for a given path of the editor.           |
| `onChange`         | `(value: string, event: editor.IModelContentChangedEvent) => void` | -            | Callback triggered when the content of the editor changes.                     |
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered when the editor mounts.                                     |

## Getting Monaco and Editor Instances

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

## Contributing

Contributions to `solid-monaco` are welcomed!

## Acknowledgments

Special thanks to the [monaco-react](https://github.com/suren-atoyan/monaco-react) package
by [Suren Atoyan](https://github.com/suren-atoyan). The package has been an invaluable reference in the development for
the Solid.js community.

## License

MIT
