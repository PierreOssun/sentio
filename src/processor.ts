import { GlobalContext, GlobalProcessor } from '@sentio/sdk/eth'
import { Gauge } from '@sentio/sdk'
import { network, startBlock } from './utils.js'


const blockUtilizationGauge = Gauge.register('block_utilization', { 
  description: 'Block gas utilization as percentage (gasUsed/gasLimit * 100)'
})

const gasUsedCounter = Gauge.register('gas_used', {
  description: 'Total gas used per block'
})

const baseFeeCounter = Gauge.register('base_fee', {
  description: 'Base fee per block'
})

const blockUtilizationHandler = async function(_: any, ctx: GlobalContext) {
  if (ctx.block) {
    const blockNumber = ctx.block.number
    const gasLimit = BigInt(ctx.block.gasLimit)
    const gasUsed = BigInt(ctx.block.gasUsed)
    const baseFee = BigInt(ctx.block.baseFeePerGas ?? 0)
    
    const utilizationPercentage = Number((gasUsed * 100n) / gasLimit)
    console.log(`Block ${blockNumber}: Gas utilization = ${utilizationPercentage.toFixed(2)}% (${gasUsed}/${gasLimit})`)
    
    blockUtilizationGauge.record(ctx, utilizationPercentage)
    gasUsedCounter.record(ctx, Number(gasUsed))
    baseFeeCounter.record(ctx, Number(baseFee))
  }
}

GlobalProcessor.bind({ network, startBlock })
  .onBlockInterval(
    blockUtilizationHandler,
    1,
    1,
    {
      block: true
    }
  )
