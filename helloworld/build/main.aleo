import token_testtzu.aleo;
program crowdfunding_program.aleo;


struct ContentInfo:
    data1 as u128;
    data2 as u128;
    data3 as u128;

struct CampaignInfo:
    title as u128;
    content as ContentInfo;
    receiver as address;
    target_amount as u64;
    current_amount as u64;
    campaign_status as boolean;

record Campaign:
    owner as address.private;
    id as field.private;
    info as CampaignInfo.private;


mapping campaigns:
	key as field.public;
	value as CampaignInfo.public;


mapping campaign_count:
	key as u32.public;
	value as u64.public;


mapping campaign_details:
	key as u64.public;
	value as field.public;


function start_new_round:
    input r0 as u32.public;
    async start_new_round r0 into r1;
    output r1 as crowdfunding_program.aleo/start_new_round.future;

finalize start_new_round:
    input r0 as u32.public;
    set 0u64 into campaign_count[r0];




function start_campaign:
    input r0 as CampaignInfo.public;
    input r1 as u32.public;
    hash.bhp256 r0.title into r2 as field;
    cast self.caller r2 r0 into r3 as Campaign.record;
    async start_campaign r2 r0 r1 into r4;
    output r3 as Campaign.record;
    output r4 as crowdfunding_program.aleo/start_campaign.future;

finalize start_campaign:
    input r0 as field.public;
    input r1 as CampaignInfo.public;
    input r2 as u32.public;
    set r1 into campaigns[r0];
    get campaign_count[r2] into r3;
    add r3 1u64 into r4;
    set r4 into campaign_count[r2];
    set r0 into campaign_details[r4];




function donate_private:
    input r0 as field.public;
    input r1 as address.private;
    input r2 as token_testtzu.aleo/token.record;
    input r3 as u64.private;
    call token_testtzu.aleo/transfer_private r2 r1 r3 into r4 r5;
    async donate_private r0 r3 into r6;
    output r4 as token_testtzu.aleo/token.record;
    output r5 as token_testtzu.aleo/token.record;
    output r6 as crowdfunding_program.aleo/donate_private.future;

finalize donate_private:
    input r0 as field.public;
    input r1 as u64.public;
    get campaigns[r0] into r2;
    gte r2.target_amount r2.current_amount into r3;
    add r2.current_amount r1 into r4;
    assert.eq r2.campaign_status true;
    assert.eq r3 true;
    cast r2.title r2.content r2.receiver r2.target_amount r4 r2.campaign_status into r5 as CampaignInfo;
    set r5 into campaigns[r0];




function donate_public:
    input r0 as field.public;
    input r1 as address.public;
    input r2 as u64.public;
    call token_testtzu.aleo/transfer_public r1 r2 into r3;
    async donate_public r0 r3 r2 into r4;
    output r4 as crowdfunding_program.aleo/donate_public.future;

finalize donate_public:
    input r0 as field.public;
    input r1 as token_testtzu.aleo/transfer_public.future;
    input r2 as u64.public;
    await r1;
    get campaigns[r0] into r3;
    gte r3.target_amount r3.current_amount into r4;
    add r3.current_amount r2 into r5;
    assert.eq r3.campaign_status true;
    assert.eq r4 true;
    cast r3.title r3.content r3.receiver r3.target_amount r5 r3.campaign_status into r6 as CampaignInfo;
    set r6 into campaigns[r0];




function finish_campaign:
    input r0 as Campaign.record;
    input r1 as field.public;
    assert.eq r0.owner self.caller;
    async finish_campaign r1 into r2;
    output r2 as crowdfunding_program.aleo/finish_campaign.future;

finalize finish_campaign:
    input r0 as field.public;
    get campaigns[r0] into r1;
    assert.eq r1.campaign_status true;
    cast r1.title r1.content r1.receiver r1.target_amount r1.current_amount false into r2 as CampaignInfo;
    set r2 into campaigns[r0];

