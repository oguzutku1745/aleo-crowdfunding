import React, { useState } from 'react';
import '../styles/NewCampaignModal.css';
import { stringConverter } from 'leostringer';

interface NewCampaignModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  onSubmit: (campaign: Campaign) => void;
}

interface Campaign {
  formattedTitle: bigint[];
  formattedContent: bigint[];
  target_amount: string;
  receiver_address: string;
}

const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onRequestClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  const handleSubmit = () => {
    let formattedTitle = stringConverter(title);
    let formattedContent = stringConverter(content);

    onSubmit({ formattedTitle, formattedContent,receiver_address: receiverAddress, target_amount: targetAmount  });
    onRequestClose();
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>New Campaign</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <label>
            Title:
            <input placeholder="Max 16 character" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Content link:
            <textarea placeholder='pastebin raw link' value={content} onChange={(e) => setContent(e.target.value)} />
          </label>
          <label>
            Target Amount:
            <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
          </label>
          <label>
            Receiver Address:
            <input type="text" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
          </label>
          <button type="submit">Create Campaign</button>
          <button type="button" onClick={onRequestClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default NewCampaignModal;
