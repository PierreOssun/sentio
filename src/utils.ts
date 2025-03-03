import { EthChainId, getProvider } from '@sentio/sdk/eth'

export const network = EthChainId.SONEIUM_MAINNET
export const startBlock = await getBlockSafely()


async function getBlockSafely(): Promise<number> {
  const provider = getProvider(network)
  const block = await provider.getBlock("latest");
  if (!block) {
      throw new Error(`Latest block not found.`);
  }
  console.log(`Block: ${block.number}`)
  return block.number - 1000;
}