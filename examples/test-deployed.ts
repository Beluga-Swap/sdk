import BeluSwapSDK from '../src';
import * as dotenv from 'dotenv';

dotenv.config();

async function test() {
  console.log('🧪 Testing deployed contract...\n');
  
  const sdk = new BeluSwapSDK({
    factoryAddress: process.env.CONTRACT_ADDRESS!,
    network: 'testnet',
  });
  
  console.log('✅ SDK initialized!');
  console.log('Contract:', process.env.CONTRACT_ADDRESS);
  console.log('Network: testnet');
  
  // Test methods when implemented
  try {
    // const pools = await sdk.factory.getTotalPools();
    // console.log('Total pools:', pools);
  } catch (error) {
    console.log('⚠️  Contract integration not implemented yet');
  }
}

test().catch(console.error);
