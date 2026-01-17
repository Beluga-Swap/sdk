// src/converters.ts
// Core conversion utilities

import { BELUGA_CONFIG } from './config';

/**
 * Price Converters
 */
export class PriceConverter {
  /**
   * Convert human price to sqrt_price_x64
   */
  static toSqrtPrice(price: number): bigint {
    if (price <= 0) throw new Error("Price must be positive");
    const sqrtPrice = Math.sqrt(price);
    return BigInt(Math.floor(sqrtPrice * Number(BELUGA_CONFIG.Q64)));
  }
  
  /**
   * Convert sqrt_price_x64 to human price
   */
  static fromSqrtPrice(sqrtPriceX64: bigint): number {
    const sqrtPrice = Number(sqrtPriceX64) / Number(BELUGA_CONFIG.Q64);
    return sqrtPrice * sqrtPrice;
  }
  
  /**
   * Format price for display
   */
  static format(sqrtPriceX64: bigint, decimals: number = 6): string {
    const price = this.fromSqrtPrice(sqrtPriceX64);
    return price.toFixed(decimals);
  }
}

/**
 * Tick Converters
 */
export class TickConverter {
  /**
   * Convert human price to tick
   */
  static priceToTick(price: number): number {
    if (price <= 0) throw new Error("Price must be positive");
    return Math.floor(Math.log(price) / Math.log(BELUGA_CONFIG.TICK_BASE));
  }
  
  /**
   * Convert tick to human price
   */
  static tickToPrice(tick: number): number {
    return Math.pow(BELUGA_CONFIG.TICK_BASE, tick);
  }
  
  /**
   * Align tick to spacing
   */
  static align(tick: number, spacing: number): number {
    return Math.floor(tick / spacing) * spacing;
  }
  
  /**
   * Create tick range from price range
   */
  static createRange(
    lowerPrice: number,
    upperPrice: number,
    spacing: number
  ): { lowerTick: number; upperTick: number } {
    return {
      lowerTick: this.align(this.priceToTick(lowerPrice), spacing),
      upperTick: this.align(this.priceToTick(upperPrice), spacing),
    };
  }
}

/**
 * Amount Converters (Stroops ↔ Human)
 */
export class AmountConverter {
  /**
   * Convert human amount to stroops
   */
  static toStroops(amount: number): bigint {
    return BigInt(Math.floor(amount * BELUGA_CONFIG.STROOPS_MULTIPLIER));
  }
  
  /**
   * Convert stroops to human amount
   */
  static fromStroops(stroops: bigint | number): number {
    const stroopsNum = typeof stroops === 'bigint' ? Number(stroops) : stroops;
    return stroopsNum / BELUGA_CONFIG.STROOPS_MULTIPLIER;
  }
  
  /**
   * Format amount for display
   */
  static format(stroops: bigint | number, decimals: number = 7): string {
    const amount = this.fromStroops(stroops);
    return amount.toFixed(decimals);
  }
  
  /**
   * Format with token symbol
   */
  static formatWithSymbol(
    stroops: bigint | number,
    symbol: string,
    decimals: number = 7
  ): string {
    return `${this.format(stroops, decimals)} ${symbol}`;
  }
}

/**
 * Fee Converters
 */
export class FeeConverter {
  /**
   * Convert percent to basis points
   */
  static percentToBps(percent: number): number {
    return Math.floor(percent * 100);
  }
  
  /**
   * Convert basis points to percent
   */
  static bpsToPercent(bps: number): number {
    return bps / 100;
  }
}

/**
 * Time Converters
 */
export class TimeConverter {
  /**
   * Convert days to ledgers
   */
  static daysToLedgers(days: number): number {
    // 1 day ≈ 17,280 ledgers (5s per ledger)
    return Math.floor(days * 17_280);
  }
  
  /**
   * Convert ledgers to days
   */
  static ledgersToDays(ledgers: number): number {
    return ledgers / 17_280;
  }
}
