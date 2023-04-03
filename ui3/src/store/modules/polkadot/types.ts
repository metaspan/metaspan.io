// import { ICurrency } from '../../../types'
import { ApiPromise } from '@polkadot/api'

// export interface PolkadotState {
//     currencies: ICurrency[]
//     currency: ICurrency
//     amount: string
//     wallet: string
//     api: Promise<ApiPromise> | null
//     genesisHash: string
// }

// export interface IEndpoint {
//   providers: Record<string, IEndpointProvider>
// }

export interface IValidator {
  name: string
  stash: Uint8Array | string | null
}

// this declaration allows us to have window.$polkadot object
export interface PolkadotWindow extends Window {
  $polkadot: any
//   name: string
//   salary: number
//   totalSalary: Function
//   display: Function
}