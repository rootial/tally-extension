import { TransactionController } from '@mekamittens/controllers/transactions'
import ObsStore from '../lib/ob-store.js'
import { createEthProviderWrapper, formatTransaction } from '../lib/utils'

export default class Transactions {
  constructor ({ state, provider, getFiatValue }) {
    this.state = new ObsStore(state)
    this.query = createEthProviderWrapper(provider)
    this.getFiatValue = getFiatValue
  }

  // temp history
  async getHistory (address, toBlock = 'latest') {
    const blockNumer = parseInt(await this.query.eth_blockNumber())
    const fiatValue = await this.getFiatValue()
    const fromBlock =  `0x${(blockNumer - (10e3 * 3)).toString(16)}`
    const toAddress = address
    const fromAddress = address
    // get transactions to the address
    const toTransfers= await this.query.alchemy_getAssetTransfers({
      fromBlock,
      toBlock,
      toAddress,
      excludeZeroValue: false,
    })
    // get transactions from the adress
    const fromTransfers = await this.query.alchemy_getAssetTransfers({
      fromBlock,
      toBlock,
      fromAddress,
      excludeZeroValue: false,
    })
    // get acctual transaction data for all transactions
    const resolvedTxs = await Promise.allSettled([
      ...toTransfers.transfers || [],
      ...fromTransfers.transfers || [],
    ].sort((txA, txB) => {
      return parseInt(txA.blockNum) - parseInt(txB.blockNum)
    }).map(async (transfer) => {
      try {
        const transaction = await this.query.eth_getTransactionByHash(transfer.hash)
        return formatTransaction({local: false, ...transaction}, fiatValue)
      } catch (e) {
        console.error(e)
      }
    }))

    // prepare final list
    const transactions = []
    resolvedTxs.forEach((ptx) => transactions.push(ptx.value) )
    return transactions
  }
}
