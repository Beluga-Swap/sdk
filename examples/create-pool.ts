// examples/create-pool.ts
// Example: Create a new pool with human-friendly inputs

import BelugaSwapSDK from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🏊 Creating a new pool...\n');
  
  // Initialize SDK
  const sdk = new BelugaSwapSDK({
    factoryAddress: process.env.FACTORY_ADDRESS!,
    network: 'testnet',
  });
  
  // Create USDC/XLM pool with normal numbers!
  const pool = await sdk.factory.createPool({
    creator: process.env.CREATOR_ADDRESS!,
    tokenA: process.env.USDC_ADDRESS!,
    tokenB: process.env.XLM_ADDRESS!,
    
    // Human-friendly inputs!
    feeTier: 'VOLATILE',           // Not 30 bps!
    creatorFeePercent: 1,          // 1%, not 100 bps!
    initialPrice: 1.0,             // Normal price!
    amount0: 100,                  // 100 USDC, not stroops!
    amount1: 100,                  // 100 XLM
    priceRangeLower: 0.95,         // Price range!
    priceRangeUpper: 1.05,
    lockDurationDays: 7,           // Days, not ledgers!
  });
  
  console.log('✅ Pool parameters prepared!\n');
  console.log('Summary:');
  console.log(JSON.stringify(pool.summary, null, 2));
  
  console.log('\nTechnical details:');
  console.log(JSON.stringify(pool.technical, null, 2));
  
  console.log('\nContract params:');
  console.log(JSON.stringify(pool.contractParams, null, 2));
  
  // TODO: Execute transaction
  // const result = await executeTransaction(pool.contractParams);
  // console.log('\n🎉 Pool created!', result);
}

main().catch(console.error);
