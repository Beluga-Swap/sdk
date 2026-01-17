// src/sdk.ts
// Main SDK class combining Factory and Pool

import { SorobanRpc } from '@stellar/stellar-sdk';
import { BelugaFactorySDK } from './factory';
import { BelugaPoolSDK } from './pool';
import { NETWORKS } from './config';
import type { NetworkConfig } from './config';

/**
 * SDK Configuration
 */
export interface BelugaSDKConfig {
  factoryAddress: string;
  poolAddress?: string;
  rpcUrl?: string;
  networkPassphrase?: string;
  network?: 'testnet' | 'mainnet';
}

/**
 * Main BelugaSwap SDK
 * Complete integration from Factory to Pool operations
 */
export class BelugaSwapSDK {
  public factory: BelugaFactorySDK;
  public pool?: BelugaPoolSDK;
  private rpc: SorobanRpc.Server;
  private networkPassphrase: string;
  
  constructor(config: BelugaSDKConfig) {
    // Determine network configuration
    let networkConfig: NetworkConfig;
    
    if (config.network) {
      // Use predefined network
      networkConfig = NETWORKS[config.network.toUpperCase() as keyof typeof NETWORKS];
    } else if (config.rpcUrl && config.networkPassphrase) {
      // Use custom network
      networkConfig = {
        rpcUrl: config.rpcUrl,
        networkPassphrase: config.networkPassphrase,
      };
    } else {
      throw new Error(
        'Must provide either "network" (testnet/mainnet) or both "rpcUrl" and "networkPassphrase"'
      );
    }
    
    this.rpc = new SorobanRpc.Server(networkConfig.rpcUrl);
    this.networkPassphrase = networkConfig.networkPassphrase;
    
    // Initialize factory
    this.factory = new BelugaFactorySDK(
      config.factoryAddress,
      this.rpc,
      this.networkPassphrase
    );
    
    // Initialize pool if address provided
    if (config.poolAddress) {
      this.pool = new BelugaPoolSDK(
        config.poolAddress,
        this.rpc,
        this.networkPassphrase
      );
    }
  }
  
  /**
   * Connect to a specific pool
   */
  connectPool(poolAddress: string): BelugaPoolSDK {
    this.pool = new BelugaPoolSDK(
      poolAddress,
      this.rpc,
      this.networkPassphrase
    );
    return this.pool;
  }
  
  /**
   * Get pool address and connect in one step
   */
  async getAndConnectPool(params: {
    tokenA: string;
    tokenB: string;
    feeTier: 'STABLE' | 'VOLATILE' | 'EXOTIC';
  }): Promise<BelugaPoolSDK> {
    const poolAddress = await this.factory.getPool(params);
    if (!poolAddress) {
      throw new Error('Pool does not exist');
    }
    return this.connectPool(poolAddress);
  }
  
  /**
   * Get RPC server instance
   */
  getRpc(): SorobanRpc.Server {
    return this.rpc;
  }
  
  /**
   * Get network passphrase
   */
  getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }
}
