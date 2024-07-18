import React, { useState } from "react";
import "../styles/DetailModal.css";

interface CampaignProps {
  title: string;
  content: string;
  receiver: string;
  target_amount: string;
  current_amount: string;
  campaign_status: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  campaign: CampaignProps;
  onDonate: (type: string, tokenRecord: string, amount: string, receiver:string) => void;
}

const CampaignDetailsModal: React.FC<ModalProps> = ({ isOpen, onRequestClose, campaign, onDonate }) => {
  const [donationType, setDonationType] = useState<string | null>(null);
  const [tokenRecord, setTokenRecord] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleDonate = () => {
    if (donationType) {
      onDonate(donationType, tokenRecord, amount, campaign.receiver);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{campaign.title}</h2>
        <p><strong>Content:</strong> {campaign.content}</p>
        <p><strong>Receiver:</strong> {campaign.receiver}</p>
        <p><strong>Target Amount:</strong> {campaign.target_amount}</p>
        <p><strong>Current Amount:</strong> {campaign.current_amount}</p>
        <p><strong>Status:</strong> {campaign.campaign_status ? "Active" : "Inactive"}</p>
        <div className="donation-buttons">
          <button onClick={() => setDonationType("private")}>Donate Private</button>
          <button onClick={() => setDonationType("public")}>Donate Public</button>
        </div>
        {donationType && (
          <div className="donation-inputs">
            {donationType === "private" && (
              <>
                <label>
                  Token Record:
                  <input
                    type="text"
                    value={tokenRecord}
                    placeholder="Derive from https://demo.leo.app/records"
                    onChange={(e) => setTokenRecord(e.target.value)}
                  />
                </label>
              </>
            )}
            <label>
              Amount:
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <button onClick={handleDonate}>Donate</button>
          </div>
        )}
        <button onClick={onRequestClose}>Close</button>
      </div>
    </div>
  );
};

export default CampaignDetailsModal;
