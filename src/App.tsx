import React, { useState, useEffect } from 'react';
import crowdfunding_app from "../helloworld/build/main.aleo?raw";
import { fetchDataFromUrl } from './helpers/main_fetcher';
import { bigIntToString } from 'leostringer';
import { Campaign } from "./components/Card";
import NewCampaignModal from './components/NewCampaignModel';
import MenuBar from "./components/MenuBar";
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import './App.css';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

import { useFetchCampaignCount, useFetchCampaignDetails, useFetchCampaigns } from './hooks/useFetchCampaignData';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { publicKey, requestTransaction, transactionStatus } = useWallet();
  const [status, setStatus] = useState<string | undefined>();
  const [txId, setTxId] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [contents, setContents] = useState<string[]>([]);
  const campaignCount = useFetchCampaignCount();
  const campaignDetails = useFetchCampaignDetails(campaignCount);
  const campaigns = useFetchCampaigns(campaignDetails);

  useEffect(() => {
    const fetchData = async () => {
      if (campaigns) {
        const titlesArray: string[] = [];
        const contentsArray: string[] = [];

        for (const campaign of campaigns) {
          console.log('Campaigns object in App component:', campaign);

          const titleString = bigIntToString(BigInt(campaign.title));
          titlesArray.push(titleString);

          const combinedDataString = `${bigIntToString(BigInt(campaign.content.data1))}${bigIntToString(BigInt(campaign.content.data2))}${bigIntToString(BigInt(campaign.content.data3))}`;

          try {
            const fetchedData = await fetchDataFromUrl(combinedDataString);
            console.log('Fetched data from URL:', fetchedData);
            contentsArray.push(fetchedData);
          } catch (error) {
            console.error('Error fetching data:', error);
            contentsArray.push("Error fetching content.")
          }

          console.log('Combined data string:', combinedDataString);
          console.log('Campaigns title in App component:', campaign.title);
        }

        setTitles(titlesArray);
        setContents(contentsArray);
      }
    };

    fetchData();
  }, [campaigns]);

  // Hardcoded for example
  const round_id = 1;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (campaign: { formattedTitle: bigint[], formattedContent: bigint[], target_amount: string, receiver_address: string }) => {
    if (!publicKey) throw new WalletNotConnectedError();
    console.log("New campaign submitted:", campaign);

    console.log(campaign.formattedTitle[0])
    const formattedTitle = `${campaign.formattedTitle[0].toString()}u128`;
    console.log(formattedTitle)
    const formattedContent = campaign.formattedContent.map(content => `${content.toString()}u128`);
  
    const newCampaignString = `{
      title: ${formattedTitle},
      content: { data1: ${formattedContent[0]}, data2: ${formattedContent[1]}, data3: ${formattedContent[2]} },
      receiver: ${campaign.receiver_address},
      target_amount: ${campaign.target_amount}u64,
      current_amount: 0u64,
      campaign_status: true
    }`;

    console.log(newCampaignString)
    const values = [newCampaignString, `${round_id}u32`];
    console.log(values)

    console.log(publicKey)

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      "crowdfunding_program.aleo",
      "start_campaign",
      values,
      100000,
      false
    );

    if (requestTransaction) {
      const tx = await requestTransaction(aleoTransaction);
      console.log(tx)
      setTxId(tx);
    }

    if (transactionStatus) {
      const status = await transactionStatus(txId);
      setStatus(status);
    }
  };

  const handleDonate = async (type: string, tokenRecord: string, amount: string, index: number, receiver: string) => {
    if (!publicKey) throw new WalletNotConnectedError();
    console.log('Donation submitted:', { type, tokenRecord, amount });

    const campaignId = campaignDetails[index];

    // Build the transaction based on the type of donation
    const values = type === 'private' 
      ? [campaignId, receiver, JSON.parse(tokenRecord), `${amount}u64`] 
      : [campaignId, receiver, `${amount}u64`];

    console.log(values);

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      "crowdfunding_program.aleo",
      type === 'private' ? 'donate_private' : 'donate_public',
      values,
      100_000,
      false,
    );

    if (requestTransaction) {
      const tx = await requestTransaction(aleoTransaction);
      setTxId(tx);
    }

    if (transactionStatus) {
      const status = await transactionStatus(txId);
      setStatus(status);
    }
  };


  return (
    <div className="container">
      <MenuBar />
      <main>
        <div className="main-header">
          <h2>Campaigns : {campaignCount !== null ? campaignCount : 'Loading...'}</h2>
          <button className="new-campaign-btn" onClick={handleOpenModal}>New Campaign</button>
        </div>
        <div className="campaigns">
          {campaigns && titles.length === campaigns.length && contents.length === campaigns.length ? (
            campaigns.map((campaign, index) => (
              <Campaign
                key={index}
                index={index}
                title={titles[index]}
                content={contents[index]}
                receiver={campaign.receiver}
                target_amount={campaign.target_amount}
                current_amount={campaign.current_amount}
                campaign_status={campaign.campaign_status}
                onDonate={handleDonate}
              />
            ))
          ) : (
            <p>Loading campaigns...</p>
          )}
        </div>
      </main>
      <footer className="footer">
        <p>Aleo Crowdfunding App. Built with ❤️</p>
      </footer>
      <NewCampaignModal isOpen={isModalOpen} onRequestClose={handleCloseModal} onSubmit={handleSubmit} />
    </div>
  );
};

export default App;
