
export interface IWalletBalance {
  free: number
  reserved: number
  miscFrozen: number
  feeFrozen: number
}

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

export interface ICandidate {
  active: boolean
  commission: number
  councilStake: number
  councilVotes: number[]
  democracyVoteCount: number
  democracyVotes: string[] | number[]
  discoveredAt: number | Date
  faults: string[]
  stash: string
  score: ICandidateScore
  rank: number
  identity: ICandidateIdentity
  location: string
  name: string
  nominatedAt: number | Date
  onlineSince: number | string
  unclaimedEras: string[]
  valid: boolean
  validity: ICandidateValidityItem[]
}

export class Candidate implements ICandidate {
  active = false
  commission = 0
  councilStake = 0
  councilVotes = [] as number[]
  democracyVoteCount = 0
  democracyVotes = [] as number[]
  discoveredAt = 0
  faults = [] as string[]
  stash = ''
  score = { total: 0 } as ICandidateScore
  rank = 0
  identity = {} as ICandidateIdentity
  location = ''
  name = ''
  nominatedAt = 0
  onlineSince = 0
  unclaimedEras = [] as string[]
  valid = false
  validity = [] as ICandidateValidityItem[]

  constructor (data: ICandidate) {
    this.active = data.active
    this.commission = data.commission
    this.councilStake = data.councilStake
    this.councilVotes = data.councilVotes
    this.democracyVoteCount = data.democracyVoteCount
    this.democracyVotes = data.democracyVotes
    this.discoveredAt = data.discoveredAt
    this.faults = data.faults
    this.stash = data.stash
    this.score = data.score
    this.rank = data.rank
    this.identity = data.identity
    this.location = data.location
    this.name = data.name
    this.nominatedAt = data.nominatedAt
    this.onlineSince = data.onlineSince
    this.unclaimedEras = data.unclaimedEras
    this.valid = data.valid
    this.validity = data.validity
    this.setValid()
  }

  setValid (validity?: ICandidateValidityItem[]): void {
    if (validity) {
      this.validity = validity
    }
    this.valid = this.validity.filter(f => f.valid === false).length === 0
  }
}

// export class Candidate <ICandidate> {
//   constructor (data: ICandidate) {
//     Object.keys(data).forEach(k => {
//       this[k] = data[k]
//     })
//     this.setValid()
//   }

//   setValid (validity?: ICandidateValidityItem[]): void {
//     if (validity) {
//       this.validity = validity
//     }
//     this.valid = validity.filter(f => f.valid).length === 0
//   }
// }

export interface ICache {
  // eslint-disable-next-line
  items: Record<string, any>
}

export interface ICandidateListFilter {
  favourite: boolean
  valid: boolean
  active: boolean
  rank: number
  score: number
}

export interface ICandidateListSort {
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
  // eslint-disable-next-line
  democracyVotes: any[]
  discoveredAt: number | Date
  // eslint-disable-next-line
  faults: any
  stash: string
  score: ICandidateScore
  rank: number
  identity: ICandidateIdentity
  location: string
  name: string
  nominatedAt: number | Date
  // eslint-disable-next-line
  onlineSince: any
  // eslint-disable-next-line
  unclaimedEras: any[]
  // valid(): boolean
  // validity: ICandidateValidityItem[]
  StorageKey: number[]
  // eslint-disable-next-line
  Type: any
}
