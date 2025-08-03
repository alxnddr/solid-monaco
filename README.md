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

_or_

```bash
yarn add solid-monaco
```

_or_

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
| ------------------ | ------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------ |
| `language`         | `string`                                                           | -            | The programming language for the editor. E.g., `"javascript"`, `"typescript"`. |
| `value`            | `string`                                                           | -            | Content of the editor.                                                         |
| `line`             | `number`                                                           | -            | Jump to specific line number in the editor.                                    |
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
| `onBeforeMount`    | `(monaco: Monaco) => void`                                         | -            | Callback triggered before editor creation for setup.                           |
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered when the editor mounts.                                     |
| `onBeforeUnmount`  | `(monaco: Monaco, editor: editor.IStandaloneCodeEditor) => void`   | -            | Callback triggered before the editor unmounts.                                 |
| `onValidate`       | `(markers: editor.IMarker[]) => void`                              | -            | Callback triggered when validation markers change.                             |

### Getting Monaco and Editor Instances

You can get instances of both `monaco` and the `editor` by using the `onMount` callback:

```jsx
import { MonacoEditor } from 'solid-monaco';

function MyEditor() {
  const handleMount = (monaco, editor) => {
    // Use monaco and editor instances here
  };

  return (
    <MonacoEditor language="javascript" value="console.log('Hello World');" onMount={handleMount} />
  );
}
```

#### Line Positioning

Jump to a specific line number in the editor:

```jsx
import { MonacoEditor } from 'solid-monaco';
import { createSignal } from 'solid-js';

function MyEditor() {
  const [currentLine, setCurrentLine] = createSignal(42);

  return (
    <div>
      <button onClick={() => setCurrentLine(100)}>Go to line 100</button>
      <MonacoEditor
        language="javascript"
        value="// Line 1\n// Line 2\n// ..."
        line={currentLine()}
      />
    </div>
  );
}
```

#### Pre-Editor Setup

Use the `beforeMount` callback to configure Monaco before the editor is created:

```jsx
import { MonacoEditor } from 'solid-monaco';

function MyEditor() {
  const handleBeforeMount = monaco => {
    // Configure Monaco before editor creation
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });

    // Register custom themes, languages, etc.
    monaco.editor.defineTheme('myCustomTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1e1e1e',
      },
    });
  };

  return (
    <MonacoEditor
      language="javascript"
      value="console.log('Hello World');"
      beforeMount={handleBeforeMount}
      theme="myCustomTheme"
    />
  );
}
```

#### Validation Markers

Monitor validation errors and warnings in real-time:

```jsx
import { MonacoEditor } from 'solid-monaco';
import { createSignal } from 'solid-js';

function MyEditor() {
  const [errors, setErrors] = createSignal([]);

  const handleValidate = markers => {
    setErrors(markers.filter(marker => marker.severity === 8)); // Errors only
    console.log('Validation markers:', markers);
  };

  return (
    <div>
      <div>Errors: {errors().length}</div>
      <MonacoEditor
        language="typescript"
        value="const x: string = 123; // Type error"
        onValidate={handleValidate}
      />
    </div>
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

| Prop               | Type                                                             | Default      | Description                                                                      |
| ------------------ | ---------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| `original`         | `string`                                                         | -            | Original content to be displayed on the left side of the diff editor.            |
| `modified`         | `string`                                                         | -            | Modified content to be displayed on the right side of the diff editor.           |
| `originalLanguage` | `string`                                                         | -            | Language for the original content.                                               |
| `modifiedLanguage` | `string`                                                         | -            | Language for the modified content.                                               |
| `originalPath`     | `string`                                                         | -            | Path for the original content used in Monaco model management.                   |
| `modifiedPath`     | `string`                                                         | -            | Path for the modified content used in Monaco model management.                   |
| `loadingState`     | `JSX.Element`                                                    | `"Loading…"` | JSX element displayed during the loading state.                                  |
| `class`            | `string`                                                         | -            | CSS class for the diff editor container.                                         |
| `theme`            | `BuiltinTheme` or `string`                                       | `"vs"`       | Theme applied to the diff editor.                                                |
| `overrideServices` | `object`                                                         | -            | Services to override the default ones provided by Monaco.                        |
| `width`            | `string`                                                         | `"100%"`     | Width of the diff editor container.                                              |
| `height`           | `string`                                                         | `"100%"`     | Height of the diff editor container.                                             |
| `options`          | `IStandaloneDiffEditorConstructionOptions`                       | -            | Correct diff editor options type (was incorrectly using regular editor options). |
| `saveViewState`    | `boolean`                                                        | `true`       | Whether to save the model view state.                                            |
| `onChange`         | `(value: string) => void`                                        | -            | Callback triggered when the content of the modified editor changes.              |
| `onMount`          | `(monaco: Monaco, editor: editor.IStandaloneDiffEditor) => void` | -            | Callback triggered when the diff editor mounts.                                  |
| `onBeforeUnmount`  | `(monaco: Monaco, editor: editor.IStandaloneDiffEditor) => void` | -            | Callback triggered before the diff editor unmounts.                              |
| `onBeforeMount`    | `(monaco: Monaco) => void`                                       | -            | Callback triggered before diff editor creation for setup.                        |

## Production Setup Guide

### Asset Loading Configuration

The library supports both CDN and local asset loading strategies.

#### CDN Loading (Default)

```jsx
// Uses CDN by default - no configuration needed
<MonacoEditor value={code()} language="javascript" />
```

#### Local Asset Loading

**1. Install Dependencies**

Ensure `monaco-editor` is a regular dependency (not devDependency) in your `package.json`:

```json
{
  "dependencies": {
    "monaco-editor": "^0.48.0",
    "solid-monaco": "^0.x.x"
  }
}
```

**2. Environment Configuration**

Create environment-specific configurations:

```bash
# .env (development)
# This allows vite to serve monaco assets directly from
# node_modules when in dev mode.
VITE_MONACO_ASSETS_PATH=/node_modules/monaco-editor/dev/vs

# .env.production
# Configure the path where minified monaco assets will be
# found. See `monacoAssetsPlugin` below.
VITE_MONACO_ASSETS_PATH=/monaco-assets/vs
```

**3. Vite Configuration**

Add a custom plugin to copy Monaco assets during build:

```typescript
// vite.config.ts
import { cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const monacoAssetsPlugin = () => {
  return {
    name: 'monaco-assets-plugin',
    generateBundle() {
      // Copy Monaco Editor assets to build output directory
      const monacoSrc = join(process.cwd(), 'node_modules/monaco-editor/min/vs');
      const buildDest = join(process.cwd(), 'dist/monaco-assets/vs');

      if (existsSync(monacoSrc)) {
        cpSync(monacoSrc, buildDest, { recursive: true });
        console.log('✓ Monaco Editor assets copied to dist directory');
      }
    },
  };
};

export default defineConfig({
  plugins: [solidPlugin(), monacoAssetsPlugin()],
  // ... other config
});
```

**4. Component Usage**

Use the environment variable to configure asset loading:

```jsx
import { MonacoDiffEditor } from 'solid-monaco';

function MyDiffEditor() {
  const configureDiffEditor = monaco => {
    // Configure JSON language features
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false,
    });

    // Configure JSON formatting
    monaco.languages.json.jsonDefaults.setModeConfiguration({
      documentFormattingEdits: true,
      documentRangeFormattingEdits: true,
      completionItems: true,
      hovers: true,
      documentSymbols: true,
      tokens: true,
      colors: true,
      foldingRanges: true,
      diagnostics: true,
      selectionRanges: true,
    });
  };

  return (
    <MonacoDiffEditor
      original={originalContent}
      modified={modifiedContent}
      originalLanguage="json"
      modifiedLanguage="json"
      height="100%"
      loaderParams={{
        paths: {
          vs: import.meta.env.VITE_MONACO_ASSETS_PATH,
        },
      }}
      onBeforeMount={configureDiffEditor}
      options={{
        theme: 'vs-dark',
        automaticLayout: true,
        readOnly: true,
        renderSideBySide: true,
        ignoreTrimWhitespace: true,
        renderIndicators: true,
        originalEditable: false,
        diffCodeLens: true,
        renderOverviewRuler: true,
        diffWordWrap: 'on',
        smoothScrolling: true,
        hideUnchangedRegions: {
          enabled: true,
          minimumLineCount: 5,
        },
      }}
    />
  );
}
```

### Build Optimization

#### Bundle Splitting

Configure Vite to split Monaco into separate chunks for better loading performance:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'solid-monaco': ['solid-monaco'],
          'monaco-editor': ['monaco-editor'],
        },
      },
    },
  },
});
```

### Troubleshooting

#### Common Issues

**Monaco assets not loading in production:**

- Ensure `monaco-editor` is in `dependencies`, not `devDependencies`
- Verify the Vite plugin is copying assets to the correct build directory
- Check that `VITE_MONACO_ASSETS_PATH` matches your actual asset path

**Large bundle size:**

- Use `import type` for Monaco types to avoid bundling the entire library
- Configure bundle splitting to separate Monaco into its own chunk
- Consider lazy loading Monaco for non-critical editor instances

**Web workers failing:**

- Ensure web worker files are accessible at the configured asset path
- Check browser console for 404 errors on worker files
- Verify CORS settings if serving assets from a different domain

## Contributing

Contributions to `solid-monaco` are welcomed!

## Acknowledgments

- [monaco-editor](https://github.com/microsoft/monaco-editor): The core editor that this package wraps for Solid.js.
- [monaco-react](https://github.com/suren-atoyan/monaco-react) by [Suren Atoyan](https://github.com/suren-atoyan): A
  package referred to during the development of the solid-monaco wrapper.

## License

MIT
