import React, { PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { SocketContextProvider, SocketReducer, defaultSocketContextState } from './Context';
import { useSocket } from '../../hooks/useSocket';
export interface ISocketContextComponentProps extends PropsWithChildren {}
const SocketContextComponent: React.FunctionComponent<ISocketContextComponentProps> = (props) => {
    const { children } = props;
    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState);
    const [loading, setLoading] = useState(true);
    const socket = useSocket('ws://localhost:1337', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false
    });
    useEffect(() => {
        /**
        | Connect to Web Socket */
        socket.connect();
        /**
        |Save the Socket in Context */
        SocketDispatch({ type: 'update_socket', payload: socket });
        /**
        | Start the event listeners */
        StartListeners();
        /**
        | Send the handshake */
        SendHandshake();
        // eslint-disable-next-line
    }, []);
    const StartListeners = () => {
        /** 
        | User Connected event */
        socket.on('user_connected', (users: string[]) => {
            console.info('User connected message received');
            SocketDispatch({ type: 'update_users', payload: users });
        });
        /** 
        | User Connected event */
        socket.on('user_disconnected', (uid: string) => {
            console.info('User disconnected message received');
            SocketDispatch({ type: 'remove_user', payload: uid });
        });
        /**
         | Reconnect the Event
         */
        socket.io.on('reconnect', (attempt) => {
            console.info('Reconnected on attempt: ' + attempt);
        });
        /**
         | Reconnect attempt Event
         */
        socket.io.on('reconnect_attempt', (attempt) => {
            console.info('Reconnection attempt: ' + attempt);
        });
        /**
         | Reconnection error
         */
        socket.io.on('reconnect_error', (error) => {
            console.info('Reconnection error: ' + error);
        });
        /**
         | Reconnection failed
         */
        socket.io.on('reconnect_failed', () => {
            console.log('Check');
            console.info('Reconnection failure.');
            alert('We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later.');
        });
    };
    const SendHandshake = () => {
        console.info('Sending handshake to server ...');
        socket.emit('handshake', (uid: string, users: string[]) => {
            console.log('User handshake callback message received');
            SocketDispatch({ type: 'update_uid', payload: uid });
            SocketDispatch({ type: 'update_users', payload: users });
            setLoading(false);
        });
    };
    if (loading) return <p>Loading socket IO.......</p>;
    return <SocketContextProvider value={{ SocketState, SocketDispatch }}>{children}</SocketContextProvider>;
};
export default SocketContextComponent;
