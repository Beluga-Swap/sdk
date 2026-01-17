// src/pool.ts
// Pool SDK for liquidity and swap operations

import { Contract, SorobanRpc } from '@stellar/stellar-sdk';
import { BELUGA_CONFIG } from './config';
import { PriceConverter, TickConverter, AmountConverter } from './converters';
import type {
  AddLiquidityParams,
  AddLiquidityResult,
  RemoveLiquidityParams,
  SwapParams,
  SwapResult,
  PreviewSwapResult,
  GetPositionParams,
  PositionInfo,
  CollectFeesParams,
  PoolState,
} from './types';

/**
 * BelugaSwap Pool SDK
 * Interact with pools using human-friendly inputs
 */
export class BelugaPoolSDK {
  private contract: Contract;
  
  constructor(
    private contractId: string,
    private rpc: SorobanRpc.Server,
    private networkPassphrase: string
  ) {
    this.contract = new Contract(contractId);
  }
  
  /**
   * Add liquidity with human-friendly inputs
   */
  async addLiquidity(params: AddLiquidityParams): Promise<AddLiquidityResult> {
    // 1. Get tick spacing
    const tickSpacing = BELUGA_CONFIG.FEE_TIERS[params.feeTier].spacing;
    
    // 2. Convert price range to ticks
    const range = TickConverter.createRange(
      params.priceRangeLower,
      params.priceRangeUpper,
      tickSpacing
    );
    
    // 3. Convert amounts to stroops
    const amount0Stroops = AmountConverter.toStroops(params.amount0);
    const amount1Stroops = AmountConverter.toStroops(params.amount1);
    
    // 4. Prepare contract params
    const contractParams = {
      owner: params.owner,
      lower_tick: range.lowerTick,
      upper_tick: range.upperTick,
      amount0_desired: amount0Stroops.toString(),
      amount1_desired: amount1Stroops.toString(),
    };
    
    return {
      summary: {
        priceRange: `${params.priceRangeLower.toFixed(4)} - ${params.priceRangeUpper.toFixed(4)}`,
        amounts: `${params.amount0} + ${params.amount1}`,
      },
      contractParams,
      technical: {
        lowerTick: range.lowerTick,
        upperTick: range.upperTick,
        tickSpacing,
        amount0Stroops: amount0Stroops.toString(),
        amount1Stroops: amount1Stroops.toString(),
      }
    };
  }
  
  /**
   * Remove liquidity with human-friendly inputs
   */
  async removeLiquidity(params: RemoveLiquidityParams) {
    if (params.liquidityPercent <= 0 || params.liquidityPercent > 100) {
      throw new Error("Liquidity percent must be between 0 and 100");
    }
    
    const tickSpacing = BELUGA_CONFIG.FEE_TIERS[params.feeTier].spacing;
    const range = TickConverter.createRange(
      params.priceRangeLower,
      params.priceRangeUpper,
      tickSpacing
    );
    
    return {
      summary: {
        removing: `${params.liquidityPercent}% of liquidity`,
        priceRange: `${params.priceRangeLower} - ${params.priceRangeUpper}`,
      },
      contractParams: {
        owner: params.owner,
        lower_tick: range.lowerTick,
        upper_tick: range.upperTick,
      },
      technical: {
        lowerTick: range.lowerTick,
        upperTick: range.upperTick,
        percentToRemove: params.liquidityPercent,
      }
    };
  }
  
  /**
   * Execute swap with human-friendly inputs
   */
  async swap(params: SwapParams): Promise<SwapResult> {
    // 1. Convert amount to stroops
    const amountInStroops = AmountConverter.toStroops(params.amountIn);
    
    // 2. Calculate slippage in bps
    const slippageBps = Math.floor(params.slippagePercent * 100);
    if (slippageBps > BELUGA_CONFIG.MAX_SLIPPAGE_BPS) {
      throw new Error("Slippage cannot exceed 50%");
    }
    
    // 3. Estimate output (placeholder - should call preview_swap)
    const currentPrice = 1.0; // TODO: Get from pool state
    const estimatedOut = params.amountIn * currentPrice;
    const minAmountOut = estimatedOut * (1 - params.slippagePercent / 100);
    const minAmountOutStroops = AmountConverter.toStroops(minAmountOut);
    
    // 4. Convert price limit
    const sqrtPriceLimitX64 = params.priceLimit 
      ? PriceConverter.toSqrtPrice(params.priceLimit)
      : BigInt(0);
    
    // 5. Prepare contract params
    const contractParams = {
      sender: params.sender,
      token_in: params.tokenIn,
      amount_in: amountInStroops.toString(),
      amount_out_min: minAmountOutStroops.toString(),
      sqrt_price_limit_x64: sqrtPriceLimitX64.toString(),
    };
    
    return {
      summary: {
        swapping: `${params.amountIn} ${params.tokenIn}`,
        estimatedOutput: `~${estimatedOut.toFixed(4)}`,
        minimumOutput: `${minAmountOut.toFixed(4)}`,
        slippage: `${params.slippagePercent}%`,
        priceLimit: params.priceLimit ? `${params.priceLimit}` : 'None',
      },
      contractParams,
      technical: {
        amountInStroops: amountInStroops.toString(),
        minAmountOutStroops: minAmountOutStroops.toString(),
        slippageBps,
        sqrtPriceLimitX64: sqrtPriceLimitX64.toString(),
      }
    };
  }
  
  /**
   * Preview swap output (read-only)
   */
  async previewSwap(params: {
    tokenIn: string;
    amountIn: number;
  }): Promise<PreviewSwapResult> {
    const amountInStroops = AmountConverter.toStroops(params.amountIn);
    
    // TODO: Call contract preview_swap
    
    // Placeholder
    return {
      amountOut: params.amountIn * 0.997,
      priceImpact: 0.3,
      newPrice: 1.003,
    };
  }
  
  /**
   * Get position info (human-readable)
   */
  async getPosition(params: GetPositionParams): Promise<PositionInfo> {
    const tickSpacing = BELUGA_CONFIG.FEE_TIERS[params.feeTier].spacing;
    const range = TickConverter.createRange(
      params.priceRangeLower,
      params.priceRangeUpper,
      tickSpacing
    );
    
    // TODO: Call contract get_position
    
    // Mock result
    const result = {
      liquidity: 10000000,
      amount0: BigInt(50_000_000),
      amount1: BigInt(50_000_000),
      fees_owed_0: BigInt(500_000),
      fees_owed_1: BigInt(500_000),
    };
    
    return {
      liquidity: result.liquidity,
      amount0: AmountConverter.fromStroops(result.amount0),
      amount1: AmountConverter.fromStroops(result.amount1),
      feesOwed0: AmountConverter.fromStroops(result.fees_owed_0),
      feesOwed1: AmountConverter.fromStroops(result.fees_owed_1),
      formatted: {
        liquidity: result.liquidity.toLocaleString(),
        amounts: `${AmountConverter.fromStroops(result.amount0)} + ${AmountConverter.fromStroops(result.amount1)}`,
        fees: `${AmountConverter.fromStroops(result.fees_owed_0)} + ${AmountConverter.fromStroops(result.fees_owed_1)}`,
      }
    };
  }
  
  /**
   * Collect fees
   */
  async collectFees(params: CollectFeesParams) {
    const tickSpacing = BELUGA_CONFIG.FEE_TIERS[params.feeTier].spacing;
    const range = TickConverter.createRange(
      params.priceRangeLower,
      params.priceRangeUpper,
      tickSpacing
    );
    
    return {
      contractParams: {
        owner: params.owner,
        lower_tick: range.lowerTick,
        upper_tick: range.upperTick,
      },
      technical: {
        lowerTick: range.lowerTick,
        upperTick: range.upperTick,
      }
    };
  }
  
  /**
   * Get current pool state (human-readable)
   */
  async getPoolState(): Promise<PoolState> {
    // TODO: Call contract get_pool_state
    
    // Mock state
    const state = {
      sqrt_price_x64: (BigInt(1) << BigInt(64)).toString(),
      current_tick: 0,
      liquidity: 100_000_000,
    };
    
    return {
      currentPrice: PriceConverter.fromSqrtPrice(BigInt(state.sqrt_price_x64)),
      currentTick: state.current_tick,
      liquidity: state.liquidity,
      technical: {
        sqrtPriceX64: state.sqrt_price_x64,
        currentTick: state.current_tick,
        liquidity: state.liquidity,
      }
    };
  }
}
