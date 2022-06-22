
export interface ICandidateIdentity {
  name: string
}

export interface ICandidateScore {
  total: number
}

export interface ICandidateValidityItem {
  _id: string
  valid: boolean
  type: string
}

export interface IWalletBalance {
  free: number
  reserved: number
  miscFrozen: number
  feeFrozen: number
}

export interface ICandidate {
  active: boolean
  commission: number
  councilStake: number
  councilVotes: number[]
  democracyVoteCount: number
  democracyVotes: any[]
  discoveredAt: number | Date
  faults: any
  stash: string
  score: ICandidateScore
  rank: number
  identity: ICandidateIdentity
  location: string
  name: string
  nominatedAt: number | Date
  onlineSince: any
  unclaimedEras: any[]
  valid(): boolean
  validity: ICandidateValidityItem[]
}

export interface ICache {
  items: Record<string, any>
}

interface ICandidateListFilter {
  favourite: boolean
  valid: boolean
  active: boolean
  rank: number
  score: number
}

interface ICandidateListSort {
  sort: string
  sortAsc: boolean
}


// export interface CacheItem {
//   data: Record<string, Item>
// }

export interface IValidator {
  // active: boolean
  commission: number
  councilStake: number
  councilVotes: number[]
  democracyVoteCount: number
  democracyVotes: any[]
  discoveredAt: number | Date
  faults: any
  stash: string
  score: ICandidateScore
  rank: number
  identity: ICandidateIdentity
  location: string
  name: string
  nominatedAt: number | Date
  onlineSince: any
  unclaimedEras: any[]
  // valid(): boolean
  // validity: ICandidateValidityItem[]
  StorageKey: number[]
  Type: any
}
