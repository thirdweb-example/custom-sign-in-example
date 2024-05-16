import { createThirdwebClient } from "thirdweb";
import "./App.css";
import { useConnect } from "thirdweb/react";
import { createWallet, injectedProvider, WalletId } from "thirdweb/wallets";
import { useState } from "react";

const client = createThirdwebClient({
  // If not using Vite, then use `process.env.NEXT_PUBLIC_CLIENT_ID`
  clientId: import.meta.env.VITE_CLIENT_ID,
});

type WalletOption = {
  name: string;
  // To get the wallet ID, refer to this link: https://portal.thirdweb.com/typescript/v5/supported-wallets
  walletId: WalletId;
};

const walletOptions: WalletOption[] = [
  {
    name: "Metamask",
    walletId: "io.metamask",
  },
  {
    name: "Coinbase",
    walletId: "com.coinbase.wallet",
  },
  {
    name: "Rabby",
    walletId: "io.rabby",
  },
  {
    name: "WalletConnect",
    walletId: "walletConnect",
  },
];

function App() {
  const { connect, isConnecting, error } = useConnect();
  const [selectedWalletId, setSelectedWalletId] = useState<WalletId>();

  const connectWithWallet = (walletId: WalletId) => {
    connect(async () => {
      const wallet = createWallet(walletId); // pass the wallet id

      // if user has metamask installed, connect to it
      if (injectedProvider(walletId)) {
        await wallet.connect({ client });
      }

      // open wallet connect modal so user can scan the QR code and connect
      else {
        await wallet.connect({
          client,
          walletConnect: { showQrModal: true },
        });
      }

      // return the wallet
      return wallet;
    });
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        {walletOptions.map((wallet) => (
          <button
            key={wallet.walletId}
            // Disable the buttons during the connecting process
            disabled={isConnecting}
            onClick={() => {
              connectWithWallet(wallet.walletId);
              setSelectedWalletId(wallet.walletId);
            }}
          >
            {isConnecting && selectedWalletId === wallet.walletId
              ? "Connecting..."
              : `Connect with ${wallet.name}`}
          </button>
        ))}
      </div>

      {error && Object.keys(error).length > 0 && (
        <div
          style={{
            marginTop: "12px",
            textAlign: "left",
            border: "1px solid black",
            padding: "4px",
            maxWidth: "251px",
          }}
        >
          <div>Error:</div>
          <pre style={{ overflowX: "auto" }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}

export default App;
