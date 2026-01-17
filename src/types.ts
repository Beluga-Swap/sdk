// src/types.ts
// TypeScript type definitions

import { FeeTier } from './config';

/**
 * Pool Creation Parameters
 */
export interface CreatePoolParams {
  creator: string;
  tokenA: string;
  tokenB: string;
  feeTier: FeeTier;
  creatorFeePercent: number;
  initialPrice: number;
  amount0: number;
  amount1: number;
  priceRangeLower: number;
  priceRangeUpper: number;
  lockDurationDays?: number;
  permanent?: boolean;
}

/**
 * Pool Creation Result
 */
export interface CreatePoolResult {
  summary: {
    pair: string;
    fee: string;
    creatorFee: string;
    initialPrice: number;
    priceRange: string;
    amounts: string;
    lockDuration: string;
  };
  contractParams: any;
  technical: {
    feeBps: number;
    creatorFeeBps: number;
    sqrtPriceX64: string;
    currentTick: number;
    tickSpacing: number;
    lowerTick: number;
    upperTick: number;
    amount0Stroops: string;
    amount1Stroops: string;
    lockDurationLedgers: number;
  };
}

/**
 * Add Liquidity Parameters
 */
export interface AddLiquidityParams {
  owner: string;
  amount0: number;
  amount1: number;
  priceRangeLower: number;
  priceRangeUpper: number;
  feeTier: FeeTier;
}

/**
 * Add Liquidity Result
 */
export interface AddLiquidityResult {
  summary: {
    priceRange: string;
    amounts: string;
  };
  contractParams: {
    owner: string;
    lower_tick: number;
    upper_tick: number;
    amount0_desired: string;
    amount1_desired: string;
  };
  technical: {
    lowerTick: number;
    upperTick: number;
    tickSpacing: number;
    amount0Stroops: string;
    amount1Stroops: string;
  };
}

/**
 * Remove Liquidity Parameters
 */
export interface RemoveLiquidityParams {
  owner: string;
  liquidityPercent: number;
  priceRangeLower: number;
  priceRangeUpper: number;
  feeTier: FeeTier;
}

/**
 * Swap Parameters
 */
export interface SwapParams {
  sender: string;
  tokenIn: string;
  amountIn: number;
  slippagePercent: number;
  priceLimit?: number;
}

/**
 * Swap Result
 */
export interface SwapResult {
  summary: {
    swapping: string;
    estimatedOutput: string;
    minimumOutput: string;
    slippage: string;
    priceLimit: string;
  };
  contractParams: {
    sender: string;
    token_in: string;
    amount_in: string;
    amount_out_min: string;
    sqrt_price_limit_x64: string;
  };
  technical: {
    amountInStroops: string;
    minAmountOutStroops: string;
    slippageBps: number;
    sqrtPriceLimitX64: string;
  };
}

/**
 * Preview Swap Result
 */
export interface PreviewSwapResult {
  amountOut: number;
  priceImpact: number;
  newPrice: number;
}

/**
 * Position Info
 */
export interface PositionInfo {
  liquidity: number;
  amount0: number;
  amount1: number;
  feesOwed0: number;
  feesOwed1: number;
  formatted: {
    liquidity: string;
    amounts: string;
    fees: string;
  };
}

/**
 * Pool State
 */
export interface PoolState {
  currentPrice: number;
  currentTick: number;
  liquidity: number;
  technical: {
    sqrtPriceX64: string;
    currentTick: number;
    liquidity: number;
  };
}

/**
 * Get Position Parameters
 */
export interface GetPositionParams {
  owner: string;
  priceRangeLower: number;
  priceRangeUpper: number;
  feeTier: FeeTier;
}

/**
 * Collect Fees Parameters
 */
export interface CollectFeesParams {
  owner: string;
  priceRangeLower: number;
  priceRangeUpper: number;
  feeTier: FeeTier;
}

/**
 * Get Pool Parameters
 */
export interface GetPoolParams {
  tokenA: string;
  tokenB: string;
  feeTier: FeeTier;
}
