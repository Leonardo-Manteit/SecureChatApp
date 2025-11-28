import { useState, useEffect } from "react";
import { getSocket, disconnectSocket } from "../../utils/socket";
import { useLocation } from "react-router-dom";
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import { deriveKeyFromPassphrase, encryptMessage, decryptMessage } from "../../utils/crypto"; 
import { getUserFromLocalStorage } from "../../utils/auth_service";

export default function ChatPage() {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [joinedRoom, setJoinedRoom] = useState(null); // State to store the room the user has joined
    const [cryptoKey, setCryptoKey] = useState(null);

    // grabs variables from the target when a user clicks "chat" on displayUsers
    const location = useLocation();
    const [user, setUser] = useState(getUserFromLocalStorage());
    const chatUser = location.state?.targetUser;

    // creates a unique room name by combining the current user and who they want to chat with.
    // soring this is important, so that either user can join the same room. (i.e instead of akk_leo, leo_akk) both users would join (akk_leo))
    const roomName = chatUser && user
        ? [user.username, chatUser.username].sort().join("_")
        : null;

    useEffect(() => {
        // derive a symmetric key when room is chosen
        const setupKey = async () => {
        if (!roomName) return;
            const passphrase = roomName; 
            const salt = new TextEncoder().encode("fixed-or-room-specific-salt");
            const key = await deriveKeyFromPassphrase(passphrase, salt);
            setCryptoKey(key);
        };
        setupKey();
    }, [roomName]);

    // useeffect that runs when user/chatuser/roomname changes; to connect/disconnect to socket.io/
    useEffect(() => { 

        // if both are not defined, do not set up socket io.
        if (!chatUser || !user) return;

        // gets or create a single socket connection
        const newSocket = getSocket();
        setSocket(newSocket);

        // join/create room
        newSocket.emit("createRoom", roomName);

        // set up listeners
        newSocket.on("roomJoined", (room) => {
            setJoinedRoom(room);
            setMessages([]);
        });

        // cleans and removes listeners and disconnects socket
        return () => {
            newSocket.off("roomJoined");
            newSocket.off("receiveMessage");
            disconnectSocket();
        };
    }, [user, chatUser, roomName]); 

    // function to send a message. error handler if key variables are not defined. clears text box after sending, used for encryption
    async function sendMessage() {
        if (!message.trim() || !socket || !roomName) return;

        const { iv, ciphertext } = await encryptMessage(cryptoKey, message);

        socket.emit("sendMessage", {
            roomName,
            user: user.username,
            iv,
            ciphertext
        });

        setMessage(""); // for gui purposes
    };

    useEffect(() => { // decryption
        if (!socket) return;

        const handler = async (data) => {
            try {
            const plaintext = await decryptMessage(cryptoKey, data.iv, data.ciphertext);
            setMessages((prev) => [...prev, { user: data.user, message: plaintext }]);
            } catch (err) {
            console.error("Decryption / integrity failed:", err); // logs error when there is an integrity fail
            setMessages((prev) => [
                ...prev,
                { user: "SYSTEM", message: "Received a tampered or corrupted message." }, //alerts the user to any tampering
            ]);
            }
        };

        socket.on("receiveMessage", handler);
        return () => socket.off("receiveMessage", handler);
    }, [socket, cryptoKey])

    return (
        <div>
            <Nav />
            <h1>Chat with {chatUser?.username}</h1>

            <div>
                <div>
                    {messages.length === 0 ? (
                        <p>No messages yet...</p>
                    ) : (
                        messages.map((m, i) => (
                            <p key={i}>
                                <b>{m.user}:</b> {m.message}
                            </p>
                        ))
                    )}
                </div>

                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button onClick={sendMessage}>Send</button>
            </div>

            <Footer />
        </div>
    );
}
