# Maker icons

Icon set for Maker. Mostly uses icons from [Feather Icons](https://github.com/feathericons/feather) plus a few manual additions.

## Using

```bash
npm install @square/maker-icons
```

Then within your Vue components:

```vue
<template>
    <span class="error">
        <alert-circle> {{ errorMessage }}
    </span>
</template>

<script>
import AlertCircle from '@square/maker-icons/AlertCircle';

export default {
    name: 'MyErrorComponent',
    components: {
        AlertCircle,
    },
    props: {
        errorMessage: {
            type: String,
            required: true,
        },
    },
};
</script>

<style scoped>
.error {
    color: red; /* only colors the text */
    fill: red; /* required to color the icon */
}
</style>
```

## Contributing

### Installing dependencies

```bash
npm ci
```

### Building

```bash
npm run build
```

### Manually adding icons

Add the svg files to the svg folder. Use kebab-case names for the file names.

### Publishing

Check you're publishing what you intend to with:

```bash
npm publish --dry-run
```

Before publishing remember to bump the version in `package.json`.

Also remember to login using `npm login`.

Then actually publish with:

```bash
npm publish
```
