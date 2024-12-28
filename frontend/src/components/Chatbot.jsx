import React, { useEffect, useState } from "react";
import axios from "axios";

function Chatbot() {
    const [input, setInput] = useState("");
    const [buttonText, setButtonText] = useState("Send");
    const [responses, setResponses] = useState([]);
    const resRef = React.useRef(null);
    const handleSend = async () => {
        if (!input) return;
        setButtonText("Sending...");
        try {
            const res = await axios.post("/api/chat", {
                message: input,
            });
            setResponses([...responses, input, res.data.reply]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
        setInput("");
        setButtonText("bobigpt");
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };
    useEffect(() => {
        if (resRef.current) {
            resRef.current.scrollTop = resRef.current.scrollHeight;
        }
    }, [responses]);
    return (
        <div className="chatbot">
            <div className="prompt">
                <input
                    type="text"
                    value={input}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="BobiGPT"
                />
                <button onClick={handleSend}>{buttonText}</button>
            </div>
            {responses.length > 0 && (
                <div className="responses" ref={resRef}>
                    {responses.map((response, index) => (
                        <div className={`response ${index % 2 === 0 ? 'even' : ''}`} key={index}>
                            {response}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Chatbot;
