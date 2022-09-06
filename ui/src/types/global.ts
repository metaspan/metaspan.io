
export interface IWalletBalance {
  free: number
  reserved: number
  miscFrozen: number
  feeFrozen: number
}

export interface ICandidateIdentity {
  _id: string
  name: string
  verified: boolean
  sub: string
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
  chain?: string
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
  democracyVotes = [] as number[] | string[]
  discoveredAt = 0 as number | Date
  faults = [] as string[]
  stash = ''
  score = { total: 0 } as ICandidateScore
  rank = 0
  identity = {} as ICandidateIdentity
  location = ''
  name = ''
  nominatedAt = 0 as number | Date
  onlineSince = 0 as number | string
  unclaimedEras = [] as string[]
  valid = false
  validity = [] as ICandidateValidityItem[]

  constructor (data: ICandidate) {
    this.active = !!data.active
    this.commission = data.commission || 0
    this.councilStake = data.councilStake || 0
    this.councilVotes = data.councilVotes || [] as number[]
    this.democracyVoteCount = data.democracyVoteCount || 0
    this.democracyVotes = data.democracyVotes
    this.discoveredAt = data.discoveredAt || 0
    this.faults = data.faults || [] as string[]
    this.stash = data.stash || ''
    this.score = data.score || { total: 0 } as ICandidateScore
    this.rank = data.rank || 0
    // console.debug('identity', JSON.stringify(Object.keys(data.identity ? data.identity : {})))
    this.identity = data.identity || {} as ICandidateIdentity
    this.location = data.location || ''
    this.name = data.name || ''
    this.nominatedAt = data.nominatedAt || 0
    this.onlineSince = data.onlineSince || 0
    this.unclaimedEras = data.unclaimedEras || []
    this.valid = !!data.valid
    this.validity = data.validity || [] as ICandidateValidityItem[]
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

interface IPoolNominee {
  stash: string
}

interface IPoolMembers {
  stash: string
  reward: string
}

export interface IPoolRoles {
  creator: undefined | string
  root: undefined | string
  nominator: undefined | string
  stateToggler: undefined | string
}

export interface IPool {
  id: number
  name: undefined | string
  roles: IPoolRoles
  state: undefined | string
  points: number
  claimable: number
  nominees: IPoolNominee[]
  members: IPoolMembers
}

export class Pool implements IPool {
  id = 0
  name = ''
  roles = {
    creator: undefined,
    root: undefined,
    nominator: undefined,
    stateToggler: undefined
  }

  state = undefined
  points = 0
  claimable = 0
  nominees = [] as IPoolNominee[]
  members = {} as IPoolMembers

  constructor (id: number, name: string) {
    this.id = id
    this.name = name
  }
}

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
