# BeluSwap SDK

Human-friendly TypeScript SDK for BeluSwap concentrated liquidity AMM on Stellar.

## Why BeluSwap SDK?

**No more manual conversions!** Use normal numbers instead of:
- ❌ Converting amounts to stroops (7 decimals)
- ❌ Calculating sqrt_price_x64 in Q64.64 format
- ❌ Converting prices to ticks
- ❌ Aligning ticks to spacing
- ❌ Converting days to ledgers
- ❌ Converting percentages to basis points

✅ **Just use human-readable inputs!**

## Installation

```bash
npm install @beluswap/sdk
```

## Quick Start

```typescript
import BeluSwapSDK from '@beluswap/sdk';

// Initialize SDK
const sdk = new BeluSwapSDK({
  factoryAddress: 'CFACTORY...',
  network: 'testnet', // or 'mainnet'
});

// Create pool with NORMAL numbers!
const pool = await sdk.factory.createPool({
  creator: 'GCREATOR...',
  tokenA: 'CDUSDC...',
  tokenB: 'CDXLM...',
  feeTier: 'VOLATILE',           // Not 30 bps!
  creatorFeePercent: 1,          // 1%, not 100 bps!
  initialPrice: 1.0,             // Normal price!
  amount0: 100,                  // 100 tokens, not stroops!
  amount1: 100,
  priceRangeLower: 0.95,         // Normal price range!
  priceRangeUpper: 1.05,
  lockDurationDays: 7,           // Days, not ledgers!
});

console.log(pool.summary);
// {
//   pair: "CDUSDC.../CDXLM...",
//   fee: "0.3%",
//   initialPrice: 1,
//   priceRange: "0.95 - 1.05",
//   amounts: "100 + 100",
//   lockDuration: "7 days"
// }
```

## Features

### ✅ Human-Friendly Inputs
- Normal prices (1.0, 2.5) instead of sqrt_price_x64
- Normal amounts (100, 500) instead of stroops
- Percentages (1% slippage) instead of basis points
- Days for lock duration instead of ledgers
- Fee tier names ('VOLATILE') instead of numbers

### ✅ Complete Integration
- **Factory SDK**: Create pools
- **Pool SDK**: Add/remove liquidity, swap, collect fees
- **Automatic Conversions**: All technical formats handled

### ✅ Type-Safe
- Full TypeScript support
- Autocomplete for all parameters
- Compile-time error checking

## Usage Examples

### 1. Initialize SDK

```typescript
import BeluSwapSDK from '@beluswap/sdk';

// Option A: Use predefined network
const sdk = new BeluSwapSDK({
  factoryAddress: 'CFACTORY...',
  network: 'testnet', // or 'mainnet'
});

// Option B: Custom network
const sdk = new BeluSwapSDK({
  factoryAddress: 'CFACTORY...',
  rpcUrl: 'https://your-rpc-url',
  networkPassphrase: 'Your Network ; Passphrase',
});
```

### 2. Add Liquidity

```typescript
// Connect to pool
const pool = await sdk.getAndConnectPool({
  tokenA: 'CDUSDC...',
  tokenB: 'CDXLM...',
  feeTier: 'VOLATILE',
});

// Add liquidity with normal numbers!
const addLiq = await pool.addLiquidity({
  owner: 'GOWNER...',
  amount0: 50,                   // 50 tokens!
  amount1: 50,
  priceRangeLower: 0.95,         // Normal prices!
  priceRangeUpper: 1.05,
  feeTier: 'VOLATILE',
});

console.log(addLiq.summary);
// { priceRange: "0.9500 - 1.0500", amounts: "50 + 50" }
```

### 3. Execute Swap

```typescript
const swap = await pool.swap({
  sender: 'GTRADER...',
  tokenIn: 'USDC',
  amountIn: 10,                  // Normal amount!
  slippagePercent: 1,            // 1%, not 100 bps!
  priceLimit: 0.95,              // Optional
});

console.log(swap.summary);
// {
//   swapping: "10 USDC",
//   estimatedOutput: "~9.9700",
//   minimumOutput: "9.9003",
//   slippage: "1%"
// }
```

### 4. Check Position

```typescript
const position = await pool.getPosition({
  owner: 'GOWNER...',
  priceRangeLower: 0.95,
  priceRangeUpper: 1.05,
  feeTier: 'VOLATILE',
});

console.log(position);
// {
//   amount0: 100,        // Human-readable!
//   amount1: 100,
//   feesOwed0: 0.5,
//   feesOwed1: 0.5
// }
```

## API Reference

### BeluSwapSDK

Main SDK class.

#### Constructor

```typescript
new BeluSwapSDK(config: {
  factoryAddress: string;
  poolAddress?: string;
  network?: 'testnet' | 'mainnet';
  rpcUrl?: string;
  networkPassphrase?: string;
})
```

#### Properties

- `factory: BelugaFactorySDK` - Factory operations
- `pool?: BelugaPoolSDK` - Pool operations (if connected)

#### Methods

- `connectPool(address: string): BelugaPoolSDK` - Connect to specific pool
- `getAndConnectPool(params): Promise<BelugaPoolSDK>` - Get and connect pool

---

### BelugaFactorySDK

Factory operations for pool creation.

#### Methods

##### `createPool(params): Promise<CreatePoolResult>`

Create a new pool.

**Parameters:**
- `creator: string` - Creator address
- `tokenA: string` - Token A address
- `tokenB: string` - Token B address
- `feeTier: 'STABLE' | 'VOLATILE' | 'EXOTIC'` - Fee tier
- `creatorFeePercent: number` - Creator fee (0.1-10%)
- `initialPrice: number` - Initial price
- `amount0: number` - Initial token0 amount
- `amount1: number` - Initial token1 amount
- `priceRangeLower: number` - Lower price bound
- `priceRangeUpper: number` - Upper price bound
- `lockDurationDays?: number` - Lock duration in days
- `permanent?: boolean` - Permanent lock?

**Returns:** Object with `summary`, `contractParams`, and `technical` details.

##### `getPool(params): Promise<string | null>`

Get pool address.

##### `poolExists(params): Promise<boolean>`

Check if pool exists.

---

### BelugaPoolSDK

Pool operations for liquidity and swaps.

#### Methods

##### `addLiquidity(params): Promise<AddLiquidityResult>`

Add liquidity to pool.

##### `removeLiquidity(params)`

Remove liquidity from pool.

##### `swap(params): Promise<SwapResult>`

Execute a swap.

##### `previewSwap(params): Promise<PreviewSwapResult>`

Preview swap output (read-only, no gas).

##### `getPosition(params): Promise<PositionInfo>`

Get position information.

##### `collectFees(params)`

Collect accumulated fees.

##### `getPoolState(): Promise<PoolState>`

Get current pool state.

---

## Fee Tiers

Three predefined fee tiers:

| Tier | Fee | Tick Spacing | Use Case |
|------|-----|--------------|----------|
| STABLE | 0.05% | 10 | Stablecoin pairs |
| VOLATILE | 0.30% | 60 | Normal volatile pairs |
| EXOTIC | 1.00% | 200 | Exotic/meme tokens |

## Examples

See [examples/](examples/) directory for complete examples:
- `create-pool.ts` - Create a new pool
- `add-liquidity.ts` - Add liquidity to pool
- `swap.ts` - Execute swaps
- `monitor-position.ts` - Monitor position value


## License

Apache 2.0

## Support

- GitHub Issues: [github.com/Beluga-Swap/sdk/issues](https://github.com/Beluga-Swap/sdk/issues)
- Discord: [discord.gg/belugaswap](https://discord.gg/belugaswap)
- Email: support@beluswap.io
