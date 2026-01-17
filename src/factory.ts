// src/factory.ts
// Factory SDK for pool creation

import { Contract, SorobanRpc } from '@stellar/stellar-sdk';
import { BELUGA_CONFIG } from './config';
import { PriceConverter, TickConverter, AmountConverter, FeeConverter, TimeConverter } from './converters';
import type { CreatePoolParams, CreatePoolResult, GetPoolParams } from './types';

/**
 * BelugaSwap Factory SDK
 * Create pools with human-friendly inputs
 */
export class BelugaFactorySDK {
  private contract: Contract;
  
  constructor(
    private contractId: string,
    private rpc: SorobanRpc.Server,
    private networkPassphrase: string
  ) {
    this.contract = new Contract(contractId);
  }
  
  /**
   * Create a new pool with human-friendly inputs
   */
  async createPool(params: CreatePoolParams): Promise<CreatePoolResult> {
    // 1. Get fee tier info
    const feeTier = BELUGA_CONFIG.FEE_TIERS[params.feeTier];
    const feeBps = feeTier.bps;
    const tickSpacing = feeTier.spacing;
    
    // 2. Convert creator fee
    const creatorFeeBps = FeeConverter.percentToBps(params.creatorFeePercent);
    if (creatorFeeBps < BELUGA_CONFIG.MIN_CREATOR_FEE_BPS || 
        creatorFeeBps > BELUGA_CONFIG.MAX_CREATOR_FEE_BPS) {
      throw new Error("Creator fee must be between 0.1% and 10%");
    }
    
    // 3. Convert initial price
    const initialSqrtPrice = PriceConverter.toSqrtPrice(params.initialPrice);
    const currentTick = TickConverter.priceToTick(params.initialPrice);
    
    // 4. Convert amounts to stroops
    const amount0Stroops = AmountConverter.toStroops(params.amount0);
    const amount1Stroops = AmountConverter.toStroops(params.amount1);
    
    // Validate minimum
    if (amount0Stroops < BELUGA_CONFIG.MIN_INITIAL_LIQUIDITY || 
        amount1Stroops < BELUGA_CONFIG.MIN_INITIAL_LIQUIDITY) {
      throw new Error("Minimum amount is 0.1 tokens each");
    }
    
    // 5. Convert price range to ticks
    const range = TickConverter.createRange(
      params.priceRangeLower,
      params.priceRangeUpper,
      tickSpacing
    );
    
    if (range.lowerTick >= range.upperTick) {
      throw new Error("Lower price must be less than upper price");
    }
    
    // 6. Convert lock duration
    let lockDuration: number;
    if (params.permanent) {
      lockDuration = 0;
    } else if (params.lockDurationDays) {
      lockDuration = TimeConverter.daysToLedgers(params.lockDurationDays);
      if (lockDuration < BELUGA_CONFIG.MIN_LOCK_DURATION_LEDGERS) {
        throw new Error("Minimum lock duration is 7 days");
      }
    } else {
      lockDuration = BELUGA_CONFIG.MIN_LOCK_DURATION_LEDGERS;
    }
    
    // 7. Prepare contract params
    const contractParams = {
      creator: params.creator,
      params: {
        token_a: params.tokenA,
        token_b: params.tokenB,
        fee_bps: feeBps,
        creator_fee_bps: creatorFeeBps,
        initial_sqrt_price_x64: initialSqrtPrice.toString(),
        amount0_desired: amount0Stroops.toString(),
        amount1_desired: amount1Stroops.toString(),
        lower_tick: range.lowerTick,
        upper_tick: range.upperTick,
        lock_duration: lockDuration,
      }
    };
    
    // 8. Return result
    return {
      summary: {
        pair: `${params.tokenA}/${params.tokenB}`,
        fee: `${feeTier.percent}%`,
        creatorFee: `${params.creatorFeePercent}%`,
        initialPrice: params.initialPrice,
        priceRange: `${params.priceRangeLower} - ${params.priceRangeUpper}`,
        amounts: `${params.amount0} + ${params.amount1}`,
        lockDuration: params.permanent 
          ? 'Permanent' 
          : `${params.lockDurationDays} days`,
      },
      contractParams,
      technical: {
        feeBps,
        creatorFeeBps,
        sqrtPriceX64: initialSqrtPrice.toString(),
        currentTick,
        tickSpacing,
        lowerTick: range.lowerTick,
        upperTick: range.upperTick,
        amount0Stroops: amount0Stroops.toString(),
        amount1Stroops: amount1Stroops.toString(),
        lockDurationLedgers: lockDuration,
      },
    };
  }
  
  /**
   * Get pool address
   */
  async getPool(params: GetPoolParams): Promise<string | null> {
    // Use contract, rpc, networkPassphrase when implementing
    console.log('Contract ID:', this.contractId);
    console.log('Using RPC:', this.rpc.serverURL);
    console.log('Network:', this.networkPassphrase);
    
    const _feeBps = BELUGA_CONFIG.FEE_TIERS[params.feeTier].bps;
    
    // TODO: Implement contract call
    // const result = await this.contract.call('get_pool_address', ...);
    
    throw new Error("Not implemented - add contract integration");
  }
  
  /**
   * Check if pool exists
   */
  async poolExists(params: GetPoolParams): Promise<boolean> {
    const pool = await this.getPool(params);
    return pool !== null;
  }
  
  /**
   * Get total number of pools
   */
  async getTotalPools(): Promise<number> {
    // TODO: Implement contract call
    throw new Error("Not implemented - add contract integration");
  }
}
