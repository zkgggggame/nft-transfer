import './App.css';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { IndexPage } from './Page/Index';
import { publicProvider } from 'wagmi/providers/public';
import { bsc, bscTestnet, mainnet, opBNB, opBNBTestnet } from 'viem/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';

const { chains, publicClient, webSocketPublicClient } = configureChains([opBNB, opBNBTestnet, bscTestnet, bsc, mainnet], [publicProvider()]);
const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [new InjectedConnector({ chains })],
  webSocketPublicClient,
});

function App() {
  return (
    <div className="App">
      <WagmiConfig config={config}>
        <IndexPage />
      </WagmiConfig>
    </div>
  );
}

export default App;
