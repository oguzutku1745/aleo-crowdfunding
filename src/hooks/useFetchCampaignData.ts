import { useState, useEffect } from 'react';

export const useFetchCampaignCount = () => {
  const [campaignCount, setCampaignCount] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignCount = async () => {
      try {
        const response = await fetch('/api/v1/testnet/program/crowdfunding_program.aleo/mapping/campaign_count/1u32');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        if (data) {
          const cleanedData = data.replace('u64', '').replace(/"/g, '').trim();
          setCampaignCount(cleanedData);
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error('Error fetching campaign count:', error);
      }
    };

    fetchCampaignCount();
  }, []);

  return campaignCount;
};

export const useFetchCampaignDetails = (campaignCount: string | null) => {
  const [campaignDetails, setCampaignDetails] = useState<any[]>([]);

  useEffect(() => {
    const fetchCampaignDetails = async (count: string) => {
      try {
        const details = [];
        for (let i = 1; i <= parseInt(count); i++) {
          const response = await fetch(`/api/v1/testnet/program/crowdfunding_program.aleo/mapping/campaign_details/${i}u64`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          details.push(data);
        }
        setCampaignDetails(details);
        console.log(details)
      } catch (error) {
        console.error('Error fetching campaign details:', error);
      }
    };

    if (campaignCount !== null) {
      fetchCampaignDetails(campaignCount);
    }
  }, [campaignCount]);

  return campaignDetails;
};

interface CampaignContent {
  data1: string;
  data2: string;
  data3: string;
}

interface Campaign {
  title: string;
  content: CampaignContent;
  receiver: string;
  target_amount: string;
  current_amount: string;
  campaign_status: boolean;
}

export const useFetchCampaigns = (campaignDetails: any[]) => {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    const fetchCampaigns = async (details: any[]) => {
      try {
        const campaignDataArray: Campaign[] = [];

        for (const detail of details) {
          const response = await fetch(`/api/v1/testnet/program/crowdfunding_program.aleo/mapping/campaigns/${detail}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.text();
          console.log('Raw fetched data:', data);

          // Clean the string data
          const cleanedData = data.replace(/(\u128|\u64)/g, '');
          console.log('Cleaned data:', cleanedData);

          // Manually parse the cleaned string data
          const titleMatch = cleanedData.match(/title: (\d+)/);
          const contentMatch = cleanedData.match(/content: \{([^}]+)\}/);
          const receiverMatch = cleanedData.match(/receiver: ([\w\d]+)/);
          const targetAmountMatch = cleanedData.match(/target_amount: (\d+)/);
          const currentAmountMatch = cleanedData.match(/current_amount: (\d+)/);
          const campaignStatusMatch = cleanedData.match(/campaign_status: (true|false)/);

          if (!titleMatch || !contentMatch || !receiverMatch || !targetAmountMatch || !currentAmountMatch || !campaignStatusMatch) {
            throw new Error('Failed to parse campaign data');
          }

          const contentString = contentMatch[1];
          const data1Match = contentString.match(/data1: (\d+)/);
          const data2Match = contentString.match(/data2: (\d+)/);
          const data3Match = contentString.match(/data3: (\d+)/);

          if (!data1Match || !data2Match || !data3Match) {
            throw new Error('Failed to parse campaign content data');
          }

          const campaignData: Campaign = {
            title: titleMatch[1],
            content: {
              data1: data1Match[1],
              data2: data2Match[1],
              data3: data3Match[1],
            },
            receiver: receiverMatch[1],
            target_amount: targetAmountMatch[1],
            current_amount: currentAmountMatch[1],
            campaign_status: campaignStatusMatch[1] === 'true',
          };

          console.log('Parsed campaign data:', campaignData);
          campaignDataArray.push(campaignData);
        }

        setCampaigns(campaignDataArray);
        console.log(campaignDataArray)
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      }
    };

    if (campaignDetails.length > 0) {
      fetchCampaigns(campaignDetails);
    }
  }, [campaignDetails]);

  return campaigns;
};
