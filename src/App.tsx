import React, {useState} from 'react';
import crowdfunding_app from "../helloworld/build/main.aleo?raw";
import { Campaign } from "./components/Card";
import NewCampaignModal from './components/NewCampaignModel';
import MenuBar from "./components/MenuBar";
import './App.css';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (campaign: { title: string; content: string; target_amount: string; receiver_address: string; }) => {
    console.log("New campaign submitted:", campaign);
    // You can add the logic to handle the new campaign submission here
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
