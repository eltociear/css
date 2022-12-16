<br>
<div align="center">

<p align="center">
    <img width="1331" alt="Screenshot 2022-12-17 at 1 23 13 AM" src="https://user-images.githubusercontent.com/33840671/208154129-712998ff-7079-4494-89c4-7ea0cc2107f0.png">
</p>
<p align="center">A webpack plugin for integrating Master CSS ahead-of-time compilation with Next.js</p>

<p align="center">
    <a aria-label="overview" href="https://github.com/master-co/css/tree/beta">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/%E2%AC%85%20back-%20?color=212022&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/%E2%AC%85%20back-%20?color=f6f7f8&style=for-the-badge">
            <img alt="NPM Version" src="https://img.shields.io/badge/%E2%AC%85%20back-%20?color=f6f7f8&style=for-the-badge">
        </picture>
    </a>
    <a aria-label="GitHub release (latest by date including pre-releases)" href="https://github.com/master-co/css/releases">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/v/release/master-co/css?include_prereleases&color=212022&label=&style=for-the-badge&logo=github&logoColor=fff">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/v/release/master-co/css?include_prereleases&color=f6f7f8&label=&style=for-the-badge&logo=github&logoColor=%23000">
            <img alt="NPM Version" src="https://img.shields.io/github/v/release/master-co/css?include_prereleases&color=f6f7f8&label=&style=for-the-badge&logo=github">
        </picture>
    </a>
    <a aria-label="NPM Package" href="https://www.npmjs.com/package/@master/css.webpack">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/dm/@master/css.webpack?color=212022&label=%20&logo=npm&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/npm/dm/@master/css.webpack?color=f6f7f8&label=%20&logo=npm&style=for-the-badge">
            <img alt="NPM package ( download / month )" src="https://img.shields.io/npm/dm/@master/css.webpack?color=f6f7f8&label=%20&logo=npm&style=for-the-badge">
        </picture>
    </a>
    <a aria-label="Discord Community" href="https://discord.gg/sZNKpAAAw6">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/discord/917780624314613760?color=212022&label=%20&logo=discord&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/discord/917780624314613760?color=f6f7f8&label=%20&logo=discord&style=for-the-badge">
            <img alt="Discord online" src="https://img.shields.io/discord/917780624314613760?color=f6f7f8&label=%20&logo=discord&style=for-the-badge">
        </picture>
    </a>
    <a aria-label="Follow @mastercorg" href="https://twitter.com/mastercorg">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/static/v1?label=%20&message=twitter&color=212022&logo=twitter&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/static/v1?label=%20&message=twitter&color=f6f7f8&logo=twitter&style=for-the-badge">
            <img alt="Follow @mastercorg" src="https://img.shields.io/static/v1?label=%20&message=twitter&color=f6f7f8&logo=twitter&style=for-the-badge">
        </picture>
    </a>
    <a aria-label="Github Actions" href="https://github.com/1aron/repo/actions/workflows/release.yml">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/actions/workflow/status/master-co/css/release.yml?branch=beta&label=%20&message=twitter&color=212022&logo=githubactions&style=for-the-badge">
            <source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/actions/workflow/status/master-co/css/release.yml?branch=beta&label=%20&message=twitter&color=f6f7f8&logo=githubactions&style=for-the-badge&logoColor=%23000">
            <img alt="Github release actions" src="https://img.shields.io/github/actions/workflow/status/master-co/css/release.yml?branch=beta&label=%20&message=twitter&color=f6f7f8&logo=githubactions&style=for-the-badge&logoColor=%23000">
        </picture>
    </a>
</p>

</div>

## Getting Started

If you don't have one, you can interactively create a new Next.js project by running:
```bash
npx create-next-app@latest --experimental-app
```

`next.config.js`
```js
const { MasterCSSWebpackPlugin } = require('@master/css.webpack')

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    webpack: (config) => {
        config.plugins.push(
            new MasterCSSWebpackPlugin(),
        )
        return config
    }
}

module.exports = nextConfig
```
Import the virtual CSS module into the entry file `app/globals.css`:
```css
@import 'master.css';
```

Now start the Next.js development server:
```bash
npm run dev
```

## Compiler Options
Master presets common configurations for various frameworks and build tools, and it works almost out of the box.

https://github.com/master-co/css/tree/beta/packages/compiler

For starters, you can enable `{ debug: true }` to see how it scans, extracts, and compiles.