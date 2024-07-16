import React, {useState} from 'react';
import crowdfunding_app from "../helloworld/build/main.aleo?raw";
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

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { publicKey, requestTransaction, transactionStatus } = useWallet();
  const [status, setStatus] = useState<string | undefined>();
  const [txId, setTxId] = useState("");

  // Hardcoded for example
  const round_id = 1;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (campaign: { title: string; content: string; target_amount: string; receiver_address: string; }) => {
    if (!publicKey) throw new WalletNotConnectedError();
    console.log("New campaign submitted:", campaign);

    const values = [campaign, `${round_id}u32`];
      
    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      "campaign_program.aleo",
      "start_campaign",
      values,
      100_000,
      false
    );

    if (requestTransaction) {
      // Returns a transaction Id, that can be used to check the status. Note this is not the on-chain transaction id
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
          <h2>Campaigns</h2>
          <button className="new-campaign-btn" onClick={handleOpenModal}>New Campaign</button>
        </div>
        <div className="campaigns">
          <Campaign
            title="Multi-Token Standard Program"
            content="ARC-21"
            target_amount="100000"
            current_amount="100"
            status="Active"
          />
          <Campaign
            title="Multi-Token Standard Program"
            content="ARC-21"
            target_amount="100000"
            current_amount="100"
            status="Active"
          />
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
