import { useEffect } from "react"


export const Receiver = () => {
    
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        }
        startReceiving(socket);
    }, []);

    function startReceiving(socket: WebSocket) {
        const video = document.createElement('video');
        document.body.appendChild(video);

        const pc = new RTCPeerConnection();
        pc.ontrack = (event) => {
            console.log(event);
            video.srcObject = new MediaStream([event.track]);
            video.play();
        }

        socket.onmessage = async (event) => {
            try {
                const message = JSON.parse(event.data);
        
                switch (message.type) {
                    case 'createOffer':
                        await pc.setRemoteDescription(message.sdp);
                        const answer = await pc.createAnswer();
                        await pc.setLocalDescription(answer);
                        
                        socket.send(JSON.stringify({
                            type: 'createAnswer',
                            sdp: answer
                        }));
                        break;
        
                    case 'iceCandidate':
                        await pc.addIceCandidate(message.candidate);
                        break;
        
                    default:
                        console.warn('Unknown message type:', message.type);
                }
            } catch (error) {
                console.error('Error handling message:', error);
            }
        };
        
    }

    return <div>
        
    </div>
}