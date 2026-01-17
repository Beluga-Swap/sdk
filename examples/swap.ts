// examples/swap.ts
// Example: Execute a swap with human-friendly inputs

import BelugaSwapSDK from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('💱 Executing swap...\n');
  
  // Initialize SDK
  const sdk = new BelugaSwapSDK({
    factoryAddress: process.env.FACTORY_ADDRESS!,
    network: 'testnet',
  });
  
  // Connect to pool
  const pool = await sdk.getAndConnectPool({
    tokenA: process.env.USDC_ADDRESS!,
    tokenB: process.env.XLM_ADDRESS!,
    feeTier: 'VOLATILE',
  });
  
  console.log('✅ Connected to pool\n');
  
  // 1. Preview swap first (no gas)
  console.log('📊 Previewing swap...');
  const preview = await pool.previewSwap({
    tokenIn: 'USDC',
    amountIn: 10,
  });
  
  console.log(`Expected output: ${preview.amountOut} XLM`);
  console.log(`Price impact: ${preview.priceImpact}%`);
  console.log(`New price: ${preview.newPrice}\n`);
  
  // Check if acceptable
  if (preview.priceImpact > 2) {
    console.log('⚠️ Price impact too high!');
    return;
  }
  
  // 2. Execute swap with normal numbers!
  console.log('🔄 Executing swap...');
  const swap = await pool.swap({
    sender: process.env.TRADER_ADDRESS!,
    tokenIn: 'USDC',
    amountIn: 10,                  // Normal amount!
    slippagePercent: 1,            // 1%, not 100 bps!
    priceLimit: 0.95,              // Optional price limit
  });
  
  console.log('\nSwap prepared:');
  console.log(JSON.stringify(swap.summary, null, 2));
  
  console.log('\nContract params:');
  console.log(JSON.stringify(swap.contractParams, null, 2));
  
  // TODO: Execute transaction
  // const result = await executeTransaction(swap.contractParams);
  // console.log('\n🎉 Swap executed!', result);
}

main().catch(console.error);
