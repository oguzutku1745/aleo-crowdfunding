# First part is for local testing, and second part is for TestnetBeta executions.
leo run start_new_round 1u32

leo run start_campaign "{
    title: 2077160157502449938194577302446444u128,
    content: {data1: 154789537931448239028249580234194842728u128, data2:68066741453145497669585541961453153893u128, data3:3420217u128},
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px,
    target_amount: 100000000u64,
    current_amount: 0u64,
    campaign_status: true
    }" 1u32

# Note that you need the token records from token_testtzu.aleo, which is also deployed in TestnetBeta currently.

leo run donate_private 2805252584833208809872967597325381727971256629741137995614832105537063464740field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px "{
      owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
      amount: 100u64.private,
      _nonce: 5452747651817795150193526237055188647512741096858365454690909360040010618464group.public
    }" 50u64

leo run donate_public 2805252584833208809872967597325381727971256629741137995614832105537063464740field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px 50u64

leo run finish_campaign "{
  owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
  id: 3313166834068393079756578439666536539162226555748526545042355726744556015433field.private,
  info: {
    title: 2077160157502449938194577302446444u128.private,
    content: {
      data1: 154789537931448239028249580234194842728u128.private,
      data2: 68066741453145497669585541961453153893u128.private,
      data3: 3420217u128.private
    },
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,
    target_amount: 100000000u64.private,
    current_amount: 0u64.private,
    campaign_status: true.private
  },
  _nonce: 4360692151069210474250668767673342969873561731467627088691671327738066769243group.public
}" 2805252584833208809872967597325381727971256629741137995614832105537063464740field

# For TestnetBeta executions, make sure that you provide your private key after --private-key statement.
leo execute --program crowdfunding_program --private-key  --broadcast start_new_round 1u32

leo execute --program crowdfunding_program --private-key  --broadcast start_campaign "{
    title: 2077160157502449938194577302446444u128,
    content: {data1: 154789537931448239028249580234194842728u128, data2:68066741453145497669585541961453153893u128, data3:3420217u128},
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px,
    target_amount: 100000000u64,
    current_amount: 0u64,
    campaign_status: true
    }" 1u32

# To donate privately, you need to have token_testtzu's private token records:
leo execute --program token_testtzu --private-key  --broadcast mint_private aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu 100000000000u64

leo execute --program crowdfunding_program --private-key  --broadcast donate_private 3313166834068393079756578439666536539162226555748526545042355726744556015433field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px "{
        owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
        amount: 100000000000u64.private,
        _nonce: 1335979800231228359281581801135524204633177467971142452729873192996459467505group.public
    }" 50000u64

leo execute --program crowdfunding_program --private-key  --broadcast finish_campaign "{
  owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
  id: 3313166834068393079756578439666536539162226555748526545042355726744556015433field.private,
  info: {
    title: 2077160157502449938194577302446444u128.private,
    content: {
      data1: 154789537931448239028249580234194842728u128.private,
      data2: 68066741453145497669585541961453153893u128.private,
      data3: 3420217u128.private
    },
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,
    target_amount: 100000000u64.private,
    current_amount: 0u64.private,
    campaign_status: true.private
  },
  _nonce: 4360692151069210474250668767673342969873561731467627088691671327738066769243group.public
}" 2805252584833208809872967597325381727971256629741137995614832105537063464740field