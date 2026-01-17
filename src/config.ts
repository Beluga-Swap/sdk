// src/config.ts
// BelugaSwap SDK Configuration

/**
 * SDK Configuration Constants
 */
export const BELUGA_CONFIG = {
  // Stellar stroops (7 decimals)
  STROOPS_DECIMALS: 7,
  STROOPS_MULTIPLIER: 10_000_000,
  
  // Q64.64 format
  Q64: BigInt(2) ** BigInt(64),
  ONE_X64: BigInt(2) ** BigInt(64), // 18446744073709551616
  
  // Tick constants
  MIN_TICK: -887272,
  MAX_TICK: 887272,
  TICK_BASE: 1.0001,
  
  // Fee tiers
  FEE_TIERS: {
    STABLE: {
      name: 'STABLE' as const,
      bps: 5,
      spacing: 10,
      percent: 0.05,
      description: 'For stablecoin pairs (0.05% fee)',
    },
    VOLATILE: {
      name: 'VOLATILE' as const,
      bps: 30,
      spacing: 60,
      percent: 0.30,
      description: 'For volatile pairs (0.30% fee)',
    },
    EXOTIC: {
      name: 'EXOTIC' as const,
      bps: 100,
      spacing: 200,
      percent: 1.00,
      description: 'For exotic/meme pairs (1.00% fee)',
    },
  },
  
  // Validation limits
  MIN_LOCK_DURATION_LEDGERS: 120_960, // ~7 days
  MIN_INITIAL_LIQUIDITY: 1_000_000,   // 0.1 tokens
  MIN_CREATOR_FEE_BPS: 10,             // 0.1%
  MAX_CREATOR_FEE_BPS: 1000,           // 10%
  MAX_SLIPPAGE_BPS: 5000,              // 50%
} as const;

/**
 * Fee tier type
 */
export type FeeTier = keyof typeof BELUGA_CONFIG.FEE_TIERS;

/**
 * Network configuration
 */
export interface NetworkConfig {
  rpcUrl: string;
  networkPassphrase: string;
  name?: string;
}

/**
 * Predefined networks
 */
export const NETWORKS = {
  TESTNET: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    name: 'Testnet',
  },
  MAINNET: {
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    name: 'Mainnet',
  },
} as const;
