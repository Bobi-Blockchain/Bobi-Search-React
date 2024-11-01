import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Wallet from "./components/Wallet";
import { useNavigate } from "react-router-dom";
export default function App() {
    const [slideBlockIsActive, setSlideBlockIsActive] = useState(false);
    const [query, setQuery] = useState("");
    const [liveCount, setLiveCount] = useState(0);
    const updateQuery = (e) => setQuery(e.target.value);
    const navigate = useNavigate();
    const handleSearch = async () => {
        navigate(`/search-results?q=${query}`);
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
    return (
        <>
            <main>
                <div
                    className={`slide-block ${
                        slideBlockIsActive ? "slide-in" : "slide-out"
                    }`}
                ></div>

                <div className="container">
                    <Nav
                        slideBlockIsActive={slideBlockIsActive}
                        setSlideBlockIsActive={setSlideBlockIsActive}
                    />

                    <div className="search-wrap">
                        <div className="search-bar">
                            <Wallet />

                            <input
                                type="text"
                                value={query}
                                onChange={updateQuery}
                                placeholder="Just start typing"
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
                        <div className="buttons">
                            <button>Buy In</button>

                            <button
                                onClick={() =>
                                    window.open(
                                        "https://www.bobiblockchain.com",
                                        "_self"
                                    )
                                }
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <footer>
                <div id="live-count">
                    Live Visits: <span id="count">{liveCount}</span>
                </div>
            </footer>
        </>
    );
}
