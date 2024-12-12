import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";

const SearchResults = () => {
    const [slideBlockIsActive, setSlideBlockIsActive] = useState(false);
    const location = useLocation();
    const [liveCount, setLiveCount] = useState(0);
    const [query, setQuery] = useState(
        new URLSearchParams(location.search).get("q") || ""
    );
    const updateQuery = (e) => setQuery(e.target.value);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const incrementLiveCount = async () => {
        try {
            await fetch("/api/increment", {
                method: "POST",
            });
        } catch (error) {
            console.error("Error incrementing live count:", error);
        }
    };
    const fetchData = async () => {
        if (!query) return;
        try {
            setLoading(true);
            const response = await fetch(`/api/search?q=${query}`, {
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
            await incrementLiveCount();
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
        fetchData();
        fetchLiveCount(); // Fetch initially when component mounts

        const interval = setInterval(() => {
            fetchLiveCount();
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            fetchData();
        }
    };
    const navigate = useNavigate();

    return (
        <div className="p-50">
            <Nav
                liveCount={liveCount}
                slideBlockIsActive={slideBlockIsActive}
                setSlideBlockIsActive={setSlideBlockIsActive}
            />

            <div className="search-div">
                <div className="search-bar">
                    <button type="button">Connect</button>
                    <input
                        className="search-input"
                        type="text"
                        name="q"
                        placeholder="Just start typing"
                        value={query}
                        onChange={updateQuery}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        type="button"
                        onClick={fetchData}
                        className="ico search-button"
                    >
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
                <button
                    type="button"
                    className="ico home-button"
                    onClick={() => navigate("/")}
                >
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.3382 1.94393L25.9705 9.82424L26.0201 9.8788C26.1701 10.0437 26.3998 10.3064 26.5943 10.6198C26.7798 10.9189 27 11.3686 27 11.8956V24.9976C27 26.1013 26.1068 27 25 27H18.7601C17.9317 27 17.2601 26.3284 17.2601 25.5V20.7939C17.2601 18.9948 15.8058 17.5405 14.0168 17.5405C12.2279 17.5405 10.7735 18.9948 10.7735 20.7939V25.5C10.7735 26.3284 10.102 27 9.27354 27H3C1.89318 27 1 26.1013 1 24.9976V11.7425C1 11.0901 1.36299 10.564 1.56986 10.3028C1.69049 10.1505 1.80873 10.0264 1.89631 9.94036C1.9407 9.89677 1.97877 9.86147 2.0074 9.83565C2.02175 9.8227 2.03384 9.81204 2.0433 9.80382L2.05551 9.79329L2.06007 9.7894L2.06278 9.7871C2.06278 9.7871 2.06356 9.78646 2.7075 10.5515L2.06356 9.78646L2.07352 9.77807L11.6288 1.94617C12.9452 0.685478 15.0206 0.684487 16.3382 1.94393ZM3.35246 11.3159L3.3468 11.3209C3.33673 11.33 3.31953 11.3459 3.29759 11.3674C3.25251 11.4117 3.19388 11.4736 3.13764 11.5446C3.07966 11.6178 3.038 11.6834 3.01374 11.7344C3.00661 11.7494 3.00238 11.7602 3 11.767V24.9976L3.00006 24.9992L3.0007 25H8.77354V20.7939C8.77354 17.8948 11.1188 15.5405 14.0168 15.5405C16.9149 15.5405 19.2601 17.8948 19.2601 20.7939V25H24.9993L24.9999 24.9992L25 24.9976V11.8956C25 11.8989 25.0008 11.8992 25 11.8956C24.9966 11.8812 24.9788 11.8095 24.8948 11.6742C24.8108 11.5389 24.7005 11.4037 24.588 11.2772L15.004 3.43645L14.9714 3.40439C14.4228 2.86484 13.5451 2.86525 12.997 3.40534L12.9644 3.43744L3.35246 11.3159Z"
                            fill="white"
                        ></path>
                    </svg>
                </button>
            </div>
            {!loading ? (
                <div className="results">
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
                        <div className="no-results">
                            No results found
                        </div>
                    ) : (
                        <div className="no-results">
                            Search Something...
                        </div>
                    )}
                </div>
            ) : (
                <div class="loader"></div>
            )}
        </div>
    );
};

export default SearchResults;
