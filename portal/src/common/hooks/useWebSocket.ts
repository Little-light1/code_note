/*
 * @Author: zhangzhen
 * @Date: 2022-07-29 13:16:38
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 10:32:35
 *
 */
import {useCallback, useRef, useState, useEffect} from 'react'; // 获取socekt连接参数

const getSokcetParams = () => {
    const token = window.localStorage.getItem('authorization');
    const userId = JSON.parse(
        window.localStorage.getItem('userInfo') || '{}',
    )?.id;
    return [token, userId];
}; // 获取告警数量

const UNREAD_WARN_COUNT = 'UNREAD_WARN_COUNT'; // 获取消息数量

const UNREAD_MSG_COUNT = 'UNREAD_MSG_COUNT'; // 获取消息的间隔

const INT_TIME = 60 * 1000; // websocket状态

const webSocketStatus = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
};

const useWebSocket = () => {
    const [token, userId] = getSokcetParams();
    const [reset, setReset] = useState<boolean>(false);
    const socket = useRef<WebSocket>();
    const sendCount = useRef<number>(1);
    const timerRef = useRef<any>();
    const [alarmCount, setAlarmCount] = useState<number>(0);
    const [messageCount, setMessageCount] = useState<number>(0);
    const [socketStatus, setSocketStatus] = useState<undefined | number>(3); // 开启事件,主动获取数据

    const socketOnOpen = useCallback(() => {
        // 判断连接状态是不是open
        if (socket?.current?.readyState === webSocketStatus.OPEN) {
            // 第一次加载触发一次
            socket?.current?.send(
                JSON.stringify({
                    businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT],
                }),
            );
        } else {
            return;
        }

        timerRef.current = setInterval(() => {
            if (
                socket?.current?.readyState === webSocketStatus.OPEN &&
                sendCount.current > 1
            ) {
                // 第一次加载触发一次
                socket?.current?.send(
                    JSON.stringify({
                        businessKey: [UNREAD_MSG_COUNT, UNREAD_WARN_COUNT],
                    }),
                );
            }
        }, INT_TIME); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketStatus]); // 关闭事件重新连接

    const socketOnClose = useCallback(
        (e) => {
            setSocketStatus(e.target.readyState);
            setReset(true);
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [reset],
    ); // 出错事件

    const socketOnError = useCallback((err: any) => {
        throw new Error(err);
    }, []); // 收发信息

    const socketOnMessage = useCallback(
        (e: any) => {
            if (e.data === 'success') return;
            const alarmCountObj = JSON.parse(e.data);
            const paramNameArr = Object.keys(alarmCountObj); // 判断返回告警保持连接否则断开连接

            if (paramNameArr[1] === 'UNREAD_WARN_COUNT') {
                sendCount.current += 1;
                setAlarmCount(alarmCountObj.UNREAD_WARN_COUNT);
                setMessageCount(alarmCountObj.UNREAD_MSG_COUNT);
            } else {
                sendCount.current = 0;
            }
        },
        [sendCount],
    ); // 初始化连接socket

    useEffect(() => {
        if (sendCount.current !== 1 || !token) return;

        try {
            const scoketUrl = `wss://${window.location.host}/aapp_socket/${userId}/${token}`;
            const socketObj = new WebSocket(scoketUrl);
            socketObj.addEventListener('close', socketOnClose);
            socketObj.addEventListener('error', socketOnError);
            socketObj.addEventListener('message', socketOnMessage);
            socketObj.addEventListener('open', socketOnOpen);
            socket.current = socketObj;
        } catch (err: any) {
            throw new Error(err);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketStatus]); // 断线重连

    useEffect(() => {
        if (!reset) return;
        setTimeout(() => {
            setReset(false);
        }, 30000);
    }, [reset]);
    return {
        alarmCount,
        messageCount,
        socket: socket.current,
    };
};

export default useWebSocket;
