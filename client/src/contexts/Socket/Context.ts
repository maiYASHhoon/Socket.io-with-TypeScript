import { Socket } from 'socket.io-client';
import { createContext } from 'react';

export interface ISocketContextState {
    socket: Socket | undefined;
    uid: String;
    users: string[];
}

export const defaultSocketContextState: ISocketContextState = {
    socket: undefined,
    uid: '',
    users: []
};

export type TSocketContextActions = 'update_socket' | 'update_uid' | 'update_users' | 'remove_user';

export type TSocketContextPayload = string | string[] | Socket;

export interface ISocketContextAction {
    type: TSocketContextActions;
    payload: TSocketContextPayload;
}

export const SocketReducer = (state: ISocketContextState, action: ISocketContextAction) => {
    console.log(`Message Received - Action: ${action.type} - Payload:`, action.payload);

    switch (action.type) {
        case 'update_socket':
            return { ...state, socket: action.payload as Socket };
        case 'update_uid':
            return { ...state, uid: action.payload as String };
        case 'update_users':
            return { ...state, users: action.payload as string[] };
        case 'remove_user':
            return { ...state, user: state.users.filter((uid) => uid !== (action.payload as string)) };
        default:
            return { ...state };
    }
};

export interface ISocketContextProps {
    SocketState: ISocketContextState;
    SocketDispatch: React.Dispatch<ISocketContextAction>;
}

const SocketContext = createContext<ISocketContextProps>({
    SocketState: defaultSocketContextState,
    SocketDispatch: () => {}
});

export const SocketContextConsumer = SocketContext.Consumer;
export const SocketContextProvider = SocketContext.Provider;

export default SocketContext;
