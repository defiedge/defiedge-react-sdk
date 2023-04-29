![Deifedge Logo](https://app.defiedge.io/favicon.png)

# @defiedge/react

[![License: MIT](https://img.shields.io/github/license/unbound-finance/defiedge-react-sdk.svg)](https://opensource.org/licenses/MIT) ![minified gzipped size](https://badgen.net/bundlephobia/minzip/@defiedge/react@0.0.1/) <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/unbound-finance/defiedge-react-sdk.svg">

@defiedge/react is a library that allows developers to integrate with the DefiEdge protocol in their React applications. It provides a set of React components that make it easy to interact with the DefiEdge API.

## Getting Started

To get started with @defiedge/react, you'll need to install it in your project. You can do this using npm:

```
npm install @defiedge/react
```
or

```
yarn add @defiedge/react
```

Once you've installed the package, you can import the components need in your React code:

```tsx
import { LiquidityCard, DefiedgeProvider } from '@defiedge/react'
```

## Components

@defiedge/react provides the following components:

### `<DefiedgeProvider>`

The `<DefiedgeProvider>` component sets up the context for the @defiedge/react. It takes a `children` prop that should be a React component or a tree of components that will have access to the context.

```tsx
import { DefiedgeProvider } from '@defiedge/react-sdk'

function App() {
  return (
    <DefiedgeProvider>
      <MyComponent />
    </DefiedgeProvider>
  )
}
```

### `<LiquidityCard>`

The `<LiquidityCard>` component provides a button that allows users to connect their wallet to the DefiEdge protocol. It takes an `strategyAddress` and `network`  prop that with show stats and functionality for that strategy.

```jsx
import { LiquidityCard, SupportedNetworkId } from '@defiedge/react'

function MyComponent() {
  return <LiquidityCard address={strategyAddress} network={SupportedNetworkId.mainnet} />
}
```

#### Types

```ts
enum SupportedChainId {
    arbitrum = 42161,
    mainnet = 1,
    optimism = 10,
    polygon = 137,
    bsc = 56
}

interface LiquidityCardProps {
  strategyAddress: string;
  network: SupportedChainId;
  color?: string; // todo: pending implementation
}
```

## Contributing

If you'd like to contribute to @defiedge/react, please create a pull request on GitHub.


## License

@defiedge/react is licensed under the [MIT License](https://opensource.org/licenses/MIT).