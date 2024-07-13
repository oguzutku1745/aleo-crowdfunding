import '../styles/MenuBar.css';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';

const MenuBar = () => {
  return (
    <header className="header">
      <h1>Aleo Crowdfunding</h1>
      <div className="header-buttons">
      <WalletMultiButton className="bg-[#154bf9]" />
      </div>
    </header>
  );
};

export default MenuBar;
