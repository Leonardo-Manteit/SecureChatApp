Leonardo Manteit
35195800

A secure peer-to-peer messaging prototype built as part of my Monash cybersecurity course.
The goal of this project is to explore secure communication protocols including authentication, symmetric encryption, integrity checking, and confidentiality protection.

SecureChatApp is a web-based chat system that demonstrates:
- User authentication with hashed passwords
- Real-time messaging using Socket.IO
- End-to-end symmetric encryption (E2EE) between users
- Integrity protection using AES-GCM authentication tags
- Confidentiality against packet sniffing tools like Wireshark
  
The app currently supports private 1-on-1 chat using a shared symmetric key derived automatically for each chat room.
Messages are encrypted client-side and only decrypted by the intended receiver

Features
- Secure authentication
- Search and connect to users by username
- Real-time communication
- End-to-end symmetric encryption
- Intergrity protection
- Confidentiality demonstrated via Wireshark (see attached image)

Tech Stack
Frontend
- React + Vite
- Socket.IO Client
- Web Crypto API (AES-GCM)
Backend
- Node.js / Express
- Socket.IO Server
- PostgreSQL (user storage)
- JWT authentication
- bcrypt password hashing

Wireshark testing was done using local-host, on port 8000.
  
<img width="474" height="475" alt="image" src="https://github.com/user-attachments/assets/1c36fa2e-2262-4942-9889-7bdb2c9b1250" />
image 1: A message sent from the user (leo) to another user (liam)

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/38f6860a-8bc0-4434-8ebe-a0f5f7682f35" />
image 2: captured wireshark of the message in image 1.
