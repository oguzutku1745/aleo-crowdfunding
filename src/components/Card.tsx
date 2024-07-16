import React from "react";

interface CampaignProps {
    title: string;
    content: string;
    status: string;
    target_amount: string;
    current_amount: string;

  }
  
  export const Campaign: React.FC<CampaignProps> = ({ title, content, current_amount, status, target_amount }) => {
    return (
      <div className="campaign">
        <p>targeted {target_amount} reached {current_amount}</p>
        <h3>{title}</h3>
        <div className="campaign-footer">
          <span className="full-view">Details</span>
          <span className="status">{status}</span>
        </div>
      </div>
    );
  };