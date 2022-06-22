<template>
    <v-container>
<pre>
const api = await ApiPromise.create()

api.at(hdr.hash) // query the chain at a specific block

api.consts [
  'system',
  'babe',
  'timestamp',
  'indices',
  'balances',
  'transactionPayment',
  'authorship',
  'staking',
  'grandpa',
  'imOnline',
  'democracy',
  'phragmenElection',
  'treasury',
  'claims',
  'utility',
  'identity',
  'society',
  'recovery',
  'vesting',
  'scheduler',
  'proxy',
  'multisig',
  'bounties',
  'childBounties',
  'tips',
  'electionProviderMultiPhase',
  'gilt',
  'bagsList',
  'paras',
  'registrar',
  'slots',
  'auctions',
  'crowdloan'
]
api.query [
  'substrate',
  'system': [
    account(addr: TAccountAddress): IAccount
    account.
      creator(),
      at(),
      hash(),
      is(),
      key(),
      keyPrefix(),
      range(),
      size(),
      sizeAt(),
      entries(),
      entriesAt(),
      entriesPaged(),
      keys(),
      keysAt(),
      keysPaged(),
      multi(),
      toJSON(),
    ],
    events: [

    ],

  ]
  'babe',
  'balances': [
    account: [
      creator(),
      at(),
      hash(),
      is(),
      key(),
      keyPrefix(),
      range(),
      size(),
      sizeAt(),
      entries(),
      entriesAt(),
      entriesPaged(),
      keys(),
      keysAt(),
      keysPaged(),
      multi(),
      toJSON(),
    ]
    locks
    reserves
    storageVersion

  ],
  'timestamp': [
    now,
  ],
  'indices',
  'transactionPayment',
  'authorship',
  'staking': [

  ]
  'offences',
  'session',
  'grandpa',
  'imOnline',
  'democracy',
  'council',
  'technicalCommittee',
  'phragmenElection',
  'technicalMembership',
  'treasury',
  'claims',
  'identity',
  'society',
  'recovery',
  'vesting',
  'scheduler',
  'proxy',
  'multisig',
  'preimage',
  'bounties',
  'childBounties',
  'tips',
  'electionProviderMultiPhase',
  'gilt',
  'bagsList',
  'configuration',
  'parasShared',
  'paraInclusion',
  'paraInherent',
  'paraScheduler',
  'paras',
  'initializer',
  'dmp',
  'ump',
  'hrmp',
  'paraSessionInfo',
  'parasDisputes',
  'registrar',
  'slots',
  'auctions',
  'crowdloan',
  'xcmPallet'
]
rpc [
  'author',
  'babe',
  'beefy',
  'chain',
  'childstate',
  'contracts',
  'dev',
  'engine',
  'net',
  'web3',
  'eth',
  'grandpa',
  'mmr',
  'offchain',
  'payment',
  'rpc',
  'state',
  'syncstate',
  'system'
]
events [
  'system',
  'indices',
  'balances',
  'staking',
  'offences',
  'session',
  'grandpa',
  'imOnline',
  'democracy',
  'council',
  'technicalCommittee',
  'phragmenElection',
  'technicalMembership',
  'treasury',
  'claims',
  'utility',
  'identity',
  'society',
  'recovery',
  'vesting',
  'scheduler',
  'proxy',
  'multisig',
  'preimage',
  'bounties',
  'childBounties',
  'tips',
  'electionProviderMultiPhase',
  'gilt',
  'bagsList',
  'paraInclusion',
  'paras',
  'ump',
  'hrmp',
  'parasDisputes',
  'registrar',
  'slots',
  'auctions',
  'crowdloan',
  'xcmPallet'
]
rx [
  'consts',
  'derive',
  'extrinsicType',
  'genesisHash',
  'hasSubscriptions',
  'queryMulti',
  'registry',
  'rpc',
  'runtimeVersion',
  'signer',
  'tx',
  'query',
  'queryAt',
]

// api.query

    api.query.system.account(ALICE),
        account.currentFree.sub(previousFree);
    // Retrieve the balance at the preceding block for Alice. For at queries
    // the format is always `.at(&lt;blockhash>, ...params)`
    api.query.system.account.at(parentHash, ALICE);
    api.query.timestamp.now(),
    api.query.session.validators()

    api.query.system.events((events) => {})

    api.registry.getChainProperties()

// api.rpc
    api.rpc.chain.getHeader();
    api.rpc.system.chain(),
    api.rpc.system.name(),
    api.rpc.system.version()
    const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
        console.log(`Chain is at block: #${header.number}`);

        if (++count === 256) {
        unsubscribe();
        process.exit(0);
        }
    });
    transfer = api.tx.balances.transfer(BOB, 12345);
    const hash = await transfer.signAndSend(alice);

// keyring
    const alicePair = keyring.getPair(ALICE);
*/

// interface IEndpointProvider {
//   name: string
//   url: string
// }

</pre>
    </v-container>
</template>
