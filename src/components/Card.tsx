import React, { useState } from "react";
import CampaignDetailsModal from "./CampaignDetailsModal";

interface CampaignProps {
  index: number;
  title: string;
  content: string;
  receiver: string;
  target_amount: string;
  current_amount: string;
  campaign_status: boolean;
  onDonate: (type: string, tokenRecord: string, amount: string, index: number, receiver: string) => void;
}

export const Campaign: React.FC<CampaignProps> = ({ index, title, content, current_amount, target_amount, campaign_status, receiver, onDonate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="campaign">
      <p>targeted {target_amount} reached {current_amount}</p>
      <h3>{title}</h3>
      <div className="campaign-footer">
        <span className="full-view" onClick={openModal}>Details</span>
        <span className="status">{campaign_status ? "Active" : "Inactive"}</span>
      </div>
      <CampaignDetailsModal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        campaign={{ title, content, receiver, target_amount, current_amount, campaign_status }} 
        onDonate={(type, tokenRecord, amount) => onDonate(type, tokenRecord, amount, index, receiver)}
      />
    </div>
  );
};
