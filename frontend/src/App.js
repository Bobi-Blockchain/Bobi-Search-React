import { useState, useEffect } from "react";

import { ethers } from "ethers";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { SwapWidget } from "@uniswap/widgets";
import {
  useWeb3Modal,
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers5/react";

import { MoonPayProvider, MoonPaySellWidget } from "@moonpay/moonpay-react";
import "@uniswap/widgets/fonts.css";
import Nav from "./components/Nav";
import Wallet from "./components/Wallet";
import { useNavigate } from "react-router-dom";
import TradingView from "./components/TradingView";
import Chatbot from "./components/Chatbot";

const projectId = "f053376d57580a3e6a1e82b2d7909004";

const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://mainnet.infura.io/v3/7da323a8f4a540d2a1cb93d8465b73f7",
};

const metadata = {
  name: "BoBi",
  description: "BoBi",
  url: "https://bibo-widgets.netlify.app",
  icons: ["https://avatars.mywebsite.com/"],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: "https://mainnet.infura.io/v3/7da323a8f4a540d2a1cb93d8465b73f7",
  defaultChainId: 1,
});

createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableAnalytics: true,
});

// const TOKEN_LIST = "https://ipfs.io/ipns/tokens.uniswap.org";
const TOKEN_LIST = [
  {
    name: "Wrapped BoBi",
    address: "0xA05edB1Def7cbf8f61B7C1aaE2786439796EB198",
    symbol: "WBoBi",
    decimals: 18,
    chainId: 1,
  },
  {
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    symbol: "DAI",
    decimals: 18,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    symbol: "USDT",
    decimals: 6,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  {
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    symbol: "USDC",
    decimals: 6,
    chainId: 1,
    logoURI:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
];

export default function App() {
  const [slideBlockIsActive, setSlideBlockIsActive] = useState(false);
  const [query, setQuery] = useState("");
  const [queryEmbed, setQueryEmbed] = useState("");
  const updateQueryEmbed = (e) => setQueryEmbed(e.target.value);
  const [liveCount, setLiveCount] = useState(0);
  const updateQuery = (e) => setQuery(e.target.value);
  const [provider, setProvider] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const { open } = useWeb3Modal();
  const { isConnected, address } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  useEffect(() => {
    window.Browser = {
      T: () => {},
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      setProvider(new ethers.providers.Web3Provider(walletProvider));
    }
  }, [isConnected, walletProvider]);

  const handleSearch = async () => {
    navigate(`/search-results?q=${query}`);
  };
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!queryEmbed) return;
    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${queryEmbed}`, {
        method: "GET",
      });

      if (!response.ok) {
        setLoading(false);
        setResults([]);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoading(false);
      setResults(data);
    } catch (error) {
      setLoading(false);
      setResults([]);
      console.error("Error fetching data:", error);
    }
  };
  const fetchLiveCount = async () => {
    try {
      const response = await fetch("/api/count");
      const data = await response.json();
      setLiveCount(data.value);
    } catch (error) {
      console.error("Error fetching live count:", error);
    }
  };
  useEffect(() => {
    fetchLiveCount(); // Fetch initially when component mounts

    const interval = setInterval(() => {
      fetchLiveCount();
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const handleKeyPressEmbed = (e) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  return (
    <MoonPayProvider apiKey="pk_test_HC0I70e31zkEEhuHBDWYtk4sCfHbGax" debug>
      <main>
        <div
          className={`slide-block ${
            slideBlockIsActive ? "slide-in" : "slide-out"
          }`}
        ></div>

        <div className="container">
          <Nav
            liveCount={liveCount}
            slideBlockIsActive={slideBlockIsActive}
            setSlideBlockIsActive={setSlideBlockIsActive}
            setIsDarkMode={setIsDarkMode}
          />

          <div className="search-wrap">
            <div className="search-bar">
              <Wallet
                provider={provider}
                open={open}
                isConnected={isConnected}
                address={address}
              />

              <input
                type="text"
                value={query}
                onChange={updateQuery}
                placeholder="Just start typing"
                onKeyDown={handleKeyPress}
              />

              <button onClick={handleSearch} className="ico">
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.5304 17.4698C18.2375 17.1769 17.7626 17.1769 17.4697 17.4698C17.1768 17.7626 17.1768 18.2375 17.4697 18.5304L18.5304 17.4698ZM21.4696 22.5304C21.7625 22.8233 22.2374 22.8233 22.5303 22.5304C22.8232 22.2375 22.8232 21.7626 22.5303 21.4697L21.4696 22.5304ZM17.4697 18.5304L21.4696 22.5304L22.5303 21.4697L18.5304 17.4698L17.4697 18.5304ZM10 18.25C5.44365 18.25 1.75 14.5563 1.75 10H0.25C0.25 15.3848 4.61522 19.75 10 19.75V18.25ZM18.25 10C18.25 14.5563 14.5563 18.25 10 18.25V19.75C15.3848 19.75 19.75 15.3848 19.75 10H18.25ZM10 1.75C14.5563 1.75 18.25 5.44365 18.25 10H19.75C19.75 4.61522 15.3848 0.25 10 0.25V1.75ZM10 0.25C4.61522 0.25 0.25 4.61522 0.25 10H1.75C1.75 5.44365 5.44365 1.75 10 1.75V0.25Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>

            <div className="widgets-wrapper">
              <div className="integrated-terminal chatbot-terminal">
                <img src="/bobigpt.jpg" alt="BoBi GPT" />
                <Chatbot />
              </div>

              <div className="integrated-terminal">
                <TradingView />
              </div>

              {isConnected && provider ? (
                <div className="Uniswap">
                  <SwapWidget
                    provider={provider}
                    onConnectWalletClick={(e) => {
                      open();
                      e.preventDefault();
                    }}
                    jsonRpcUrlMap={{
                      1: [
                        "https://mainnet.infura.io/v3/7da323a8f4a540d2a1cb93d8465b73f7",
                      ],
                    }}
                    defaultChainId={1}
                    tokenList={TOKEN_LIST}
                    routerUrl="https://api.uniswap.org/v1/"
                  />
                </div>
              ) : (
                <div className="Uniswap wallet-not-connected">
                  <SwapWidget
                    onConnectWalletClick={(e) => {
                      open();
                      e.preventDefault();
                    }}
                    jsonRpcUrlMap={{
                      1: [
                        "https://mainnet.infura.io/v3/7da323a8f4a540d2a1cb93d8465b73f7",
                      ],
                    }}
                    defaultChainId={1}
                    tokenList={TOKEN_LIST}
                    routerUrl="https://api.uniswap.org/v1/"
                  />
                </div>
              )}

              <div className="integrated-terminal search-terminal">
                <img src="/search.png" alt="BoBi GPT" className="search-bg" />
                <div className="search-wrapper-div">
                  <div className="search-bar search-bar-embedded">
                    <input
                      type="text"
                      value={queryEmbed}
                      onChange={updateQueryEmbed}
                      placeholder="Just start typing"
                      onKeyDown={handleKeyPressEmbed}
                    />
                    <button onClick={fetchData} className="ico">
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.5304 17.4698C18.2375 17.1769 17.7626 17.1769 17.4697 17.4698C17.1768 17.7626 17.1768 18.2375 17.4697 18.5304L18.5304 17.4698ZM21.4696 22.5304C21.7625 22.8233 22.2374 22.8233 22.5303 22.5304C22.8232 22.2375 22.8232 21.7626 22.5303 21.4697L21.4696 22.5304ZM17.4697 18.5304L21.4696 22.5304L22.5303 21.4697L18.5304 17.4698L17.4697 18.5304ZM10 18.25C5.44365 18.25 1.75 14.5563 1.75 10H0.25C0.25 15.3848 4.61522 19.75 10 19.75V18.25ZM18.25 10C18.25 14.5563 14.5563 18.25 10 18.25V19.75C15.3848 19.75 19.75 15.3848 19.75 10H18.25ZM10 1.75C14.5563 1.75 18.25 5.44365 18.25 10H19.75C19.75 4.61522 15.3848 0.25 10 0.25V1.75ZM10 0.25C4.61522 0.25 0.25 4.61522 0.25 10H1.75C1.75 5.44365 5.44365 1.75 10 1.75V0.25Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  </div>
                  {!loading ? (
                    <div className="results results-embedded">
                      {results?.web?.results?.length > 0 ? (
                        results.web.results.map((result, index) => (
                          <div className="result" key={index}>
                            <div className="result-header">
                              <img src={result.profile.img} alt="img" />
                              <div>
                                <a
                                  href={result.profile.url}
                                  className="result-profile-name unstyled-link"
                                >
                                  {result.profile.name}
                                </a>
                                <a
                                  href={result.profile.url}
                                  className="result-profile-url unstyled-link"
                                >
                                  {result.url}
                                </a>
                              </div>
                            </div>
                            <div className="result-description">
                              <span>{result.age} - </span>
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: result.description,
                                }}
                              ></p>
                            </div>
                          </div>
                        ))
                      ) : results !== null ? (
                        <div
                          className="no-results"
                          style={{
                            backgroundColor: "#ffffffc4",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          No results found
                        </div>
                      ) : (
                        <div
                          className="no-results"
                          style={{
                            backgroundColor: "#ffffffc4",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          Search Something...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div class="loader"></div>
                  )}
                </div>
              </div>

              <div className="integrated-terminal">
                <iframe
                  src="https://www.bobiscan.org/"
                  title="Integrated Terminal"
                ></iframe>
              </div>

              <div className="integrated-terminal charts-terminal">
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  initial-currency="usd"
                  height="200"
                ></gecko-coin-price-chart-widget>
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  coin-id="solana"
                  initial-currency="usd"
                  height="200"
                ></gecko-coin-price-chart-widget>
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  coin-id="pepe"
                  initial-currency="usd"
                ></gecko-coin-price-chart-widget>
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  coin-id="basic-attention-token"
                  initial-currency="usd"
                  height="200"
                ></gecko-coin-price-chart-widget>
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  coin-id="helium"
                  initial-currency="usd"
                  height="200"
                ></gecko-coin-price-chart-widget>
                <gecko-coin-price-chart-widget
                  locale="en"
                  outlined="true"
                  coin-id="binancecoin"
                  initial-currency="usd"
                  height="200"
                ></gecko-coin-price-chart-widget>
              </div>

              <div className="integrated-terminal">
                <iframe
                  width="360"
                  height="440"
                  src="https://rss.app/embed/v1/carousel/tb3pqaLWSfshBM1K"
                  frameborder="0"
                ></iframe>
              </div>

              <div className="integrated-terminal">
                <MoonPaySellWidget
                  variant="embedded"
                  baseCurrencyCode="eth"
                  baseCurrencyAmount="0.1"
                  quoteCurrencyCode="usd"
                  visible
                />
              </div>

              <div className="integrated-terminal">
                <iframe
                  src="https://www.Cryptojobslist.com/"
                  title="Integrated Terminal"
                ></iframe>
              </div>

              <div className="buttons">
                <button
                  onClick={() =>
                    (window.location.href = "mailto:build@bobi.io")
                  }
                >
                  Buy In
                </button>

                <button
                  onClick={() =>
                    window.open("https://www.bobiblockchain.com", "_self")
                  }
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MoonPayProvider>
  );
}
