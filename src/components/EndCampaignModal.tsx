import React, { useState } from 'react';
import '../styles/NewCampaignModal.css';
import { bigIntToString } from 'leostringer';

interface EndCampaignModalProps {
  campaigns: CampaignProps[] | null;
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (record: string, index: number) => void;
}

interface CampaignContent {
  data1: string;
  data2: string;
  data3: string;
}

interface CampaignProps {
  title: string;
  content: string | CampaignContent;
  receiver: string;
  target_amount: string;
  current_amount: string;
  campaign_status: boolean;
}

const EndCampaignModal: React.FC<EndCampaignModalProps> = ({ campaigns, isOpen, onRequestClose, onSubmit }) => {
  const [record, setRecord] = useState('');
  const [index, setIndex] = useState<number>();

  const handleSubmit = () => {
    if (index === undefined) {
      throw new Error("Index is required");
    }

    onSubmit(record, index);
    onRequestClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Choose Your Campaign</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <label>
            Title:
            <select onChange={(e) => setIndex(Number(e.target.value))} value={index !== undefined ? index : ''}>
              <option value="" disabled>Select a campaign</option>
              {campaigns && campaigns.map((campaign, idx) => (
                <option key={idx} value={idx}>{bigIntToString(BigInt(campaign.title))}</option>
              ))}
            </select>
          </label>
          <label>
            Record:
            <textarea
              placeholder='Derive from https://demo.leo.app/records'
              value={record}
              onChange={(e) => setRecord(e.target.value)}
            />
          </label>
          <button type="submit">Create Campaign</button>
          <button type="button" onClick={onRequestClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EndCampaignModal;
