# Developing Custom Scripts for Firebot

## Startup Scripts

Same structure as a custom effect script, runs once at startup

## Gotchas

- The value of the `runRequest.trigger` is an empty object, so `runRequest.trigger.type` will throw an error
  - question to ask is if this is intentional behavior
- When adding effects to Firebot the settings components, i.e. the `eos-*` components, are all under `gui/app/directives/effect-option-settings`
- Using html files to hold component code
  - Add the `html-loader` to your dev dependencies
  - Add a `rule` to your webpack config
  - Add an `html.d.ts` typings file with the contents:

```ts
declare module '*.html' {
  const value: string;
  export default value;
}
```

## Developing both a startup and custom script effect

- Add an additional entry to the `entry` object in `webpack.config.js`, update the `output.filename` setting to include the entry name (or use some other webpack variable)
  - e.g. `${packageJson.scriptOutputName}.[name].js`
