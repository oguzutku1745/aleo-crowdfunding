import token_testtzu.aleo;

// The 'crowdfunding_program' program.
program crowdfunding_program.aleo {

    struct CampaignInfo {
        title: u128,
        content: ContentInfo,
        receiver: address,
        target_amount: u64,
        current_amount: u64,
        campaign_status: bool
    }

    // To use an external service like pastebin
    struct ContentInfo {
        data1: u128,
        data2: u128,
        data3: u128,
    }

    // Proposal record records proposal info publicly
    record Campaign {
        owner: address,
        id: field,
        info: CampaignInfo,
    }

    mapping campaigns: field => CampaignInfo;
    // This is to count the total number of campaigns in a round. Currently, it is just for this round.
    mapping campaign_count: u32 => u64;
    // Mapping to fetch data in frontend
    mapping campaign_details: u64 => field;

    /* 
    leo run start_new_round 1u32

    leo execute --program crowdfunding_program --private-key  --broadcast start_new_round 1u32

    */

    

    async transition start_new_round(public round_number:u32) -> Future {

        return finalize_start_new_round(round_number);
    }

    async function finalize_start_new_round(public round_number:u32) {
        Mapping::set(campaign_count, round_number, 0u64);
    }

    /* 
    leo run start_campaign "{
    title: 2077160157502449938194577302446444u128,
    content: {data1: 154789537931448239028249580234194842728u128, data2:68066741453145497669585541961453153893u128, data3:3420217u128},
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px,
    target_amount: 100000000u64,
    current_amount: 0u64,
    campaign_status: true
    }" 1u32

    leo execute --program crowdfunding_program --private-key  --broadcast start_campaign "{
    title: 2077160157502449938194577302446444u128,
    content: {data1: 154789537931448239028249580234194842728u128, data2:68066741453145497669585541961453153893u128, data3:3420217u128},
    receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px,
    target_amount: 100000000u64,
    current_amount: 0u64,
    campaign_status: true
    }" 1u32
    */

    // Create new campaign
    async transition start_campaign(public info: CampaignInfo, public round_number:u32) -> (Campaign, Future) {
        // Generate a new proposal id.
        let id: field = BHP256::hash_to_field(info.title);

        // Return a new record for the proposal.
        // Finalize the proposal id.
        return (Campaign { owner: self.caller, id, info }, finalize_start_campaign(id, info, round_number));
    }
    // Create a new proposal in the "tickets" mapping.
    async function finalize_start_campaign(public id: field, info:CampaignInfo, public round_number:u32) {
        Mapping::set(campaigns, id, info);
        let campaigns_in_round:u64 = Mapping::get(campaign_count, round_number);
        let new_count: u64 = campaigns_in_round + 1u64;
        Mapping::set(campaign_count, round_number, new_count);
        Mapping::set(campaign_details, new_count, id);
    }

    /* 
    leo run donate_private 2805252584833208809872967597325381727971256629741137995614832105537063464740field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px "{
      owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
      amount: 100u64.private,
      _nonce: 5452747651817795150193526237055188647512741096858365454690909360040010618464group.public
    }" 50u64

    leo execute --program token_testtzu --private-key  --broadcast mint_private aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu 100000000000u64

    leo execute --program crowdfunding_program --private-key  --broadcast donate_private 3313166834068393079756578439666536539162226555748526545042355726744556015433field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px "{
        owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
        amount: 100000000000u64.private,
        _nonce: 1335979800231228359281581801135524204633177467971142452729873192996459467505group.public
    }" 50000u64

    */

    // Make a private donation
    async transition donate_private(public id: field, receiver: address, token: token_testtzu.aleo/token, amount: u64) -> (token_testtzu.aleo/token,token_testtzu.aleo/token, Future) {

        let (input_record, output_record):(token_testtzu.aleo/token, token_testtzu.aleo/token) = token_testtzu.aleo/transfer_private(token, receiver, amount);

        return (input_record,output_record, finalize_donate_private(id,amount));
    }

    // Make a public donation
    async function finalize_donate_private(public id: field ,public amount: u64 ) {
        let campaign: CampaignInfo = Mapping::get(campaigns, id);
        let status: bool = campaign.target_amount.gte(campaign.current_amount);
        let donated_amount:u64 = campaign.current_amount + amount;

        assert_eq(campaign.campaign_status, true);
        assert_eq(status, true);

        let campaign_to_submit: CampaignInfo = CampaignInfo {
            title: campaign.title,
            content: campaign.content,
            receiver: campaign.receiver,
            target_amount: campaign.target_amount,
            current_amount: donated_amount,
            campaign_status: campaign.campaign_status
        };

        Mapping::set(campaigns, id, campaign_to_submit);
    }

    /* 
    leo run donate_public 2805252584833208809872967597325381727971256629741137995614832105537063464740field aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px 50u64
    */

    async transition donate_public(public id:field, public receiver:address,  public amount:u64) -> Future {

        let donate_future:Future = token_testtzu.aleo/transfer_public(receiver, amount);

        return finalize_donate_public( id, donate_future, amount );
    }

    async function finalize_donate_public(public id:field, donate_future: Future, public amount:u64) {
        donate_future.await();
        let campaign: CampaignInfo = Mapping::get(campaigns, id);
        let status: bool = campaign.target_amount.gte(campaign.current_amount);
        let donated_amount:u64 = campaign.current_amount + amount;

        assert_eq(campaign.campaign_status, true);
        assert_eq(status, true);

        let campaign_to_submit: CampaignInfo = CampaignInfo {
            title: campaign.title,
            content: campaign.content,
            receiver: campaign.receiver,
            target_amount: campaign.target_amount,
            current_amount: donated_amount,
            campaign_status: campaign.campaign_status
        };

        Mapping::set(campaigns, id, campaign_to_submit);
    }

    /* 
    leo run finish_campaign "{
      owner: aleo1pqcumqvf0vjqq800uuyaqqt6s2q6dxcgglywhf6dpzac2cmjgu8q2876eu.private,
      id: 2805252584833208809872967597325381727971256629741137995614832105537063464740field.private,
      info: {
        title: 2077160157502449938194577302446444field.private,
        content: 1452374294790018907888397545906607852827800436field.private,
        receiver: aleo1rhgdu77hgyqd3xjj8ucu3jj9r2krwz6mnzyd80gncr5fxcwlh5rsvzp9px.private,
        target_amount: 100000000u64.private,
        current_amount: 0u64.private,
        campaign_status: true.private
      },
      _nonce: 2610229999357070123523164844278911477761481735686198886273663615199746102543group.public
    }" 2805252584833208809872967597325381727971256629741137995614832105537063464740field
    */

    // Publicly finish campaign. Only callable by Campaign owner
    async transition finish_campaign(private campaign: Campaign,public id:field) -> Future {

        assert_eq(campaign.owner, self.caller);
        return finalize_finish_campaign(id);
    }

    async function finalize_finish_campaign(public id:field) {
        let campaign: CampaignInfo = Mapping::get(campaigns, id);
        assert_eq(campaign.campaign_status, true);

        let campaign_to_submit: CampaignInfo = CampaignInfo {
            title: campaign.title,
            content: campaign.content,
            receiver: campaign.receiver,
            target_amount: campaign.target_amount,
            current_amount: campaign.current_amount,
            campaign_status: false
        };

        Mapping::set(campaigns, id, campaign_to_submit);
    }

}
