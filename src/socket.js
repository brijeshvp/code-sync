import {io} from "socket.io-client"

export const initSocket = async () => {
    const options = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    };

    // client socket instance returned by this io fn
    return io(process.env.REACT_APP_BACKEND_URL, options);
}