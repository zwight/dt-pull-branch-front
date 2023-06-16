import { CloseCircleOutlined } from '@ant-design/icons';
import { Modal, notification } from 'antd';
import { NotificationInstance } from 'antd/lib/notification/interface';

let _singletonNotificationCursorTime = 0;
/**
 * 校验是否处在单实例的时间段
 */
function checkIsTimeout() {
    const offset = 1000;
    const now = new Date().getTime();
    const old = _singletonNotificationCursorTime;

    _singletonNotificationCursorTime = new Date().getTime();
    if (now - offset > old) {
        return true;
    }
    return false;
}

/**
 * 包装一下
 */
export function dtNotification(title: any, message: any, type: any, icon: any, config: any) {
    const showType: any = type || 'error';
    const WrapperModal: any = Modal;
    const showMessage =
        message?.length > 100 ? (
            <span>
                {message.substring(0, 100)}...{' '}
                <a
                    onClick={() => {
                        WrapperModal[showType]({
                            title,
                            icon,
                            content: message,
                            width: 520,
                            style: { wordBreak: 'break-word' },
                        });
                    }}
                >
                    查看详情
                </a>
            </span>
        ) : (
            message
        );
    notification[showType as keyof NotificationInstance]({
        ...config,
        message: title,
        description: showMessage,
        icon,
    });
}

/**
 * 全局唯一的notification实例
 * 规则：在固定时间段内，相连并且相同的错误信息只会弹出一个。
 * @param {*} title
 * @param {*} message
 */
export function singletonNotification(
    title: any,
    message?: any,
    type?: any,
    icon?: any,
    style?: any
) {
    const notifyMsgs = document.querySelectorAll('.ant-notification-notice-description');

    /**
     * 1.当前无实例
     * 2.当前存在实例，但是当前实例的最后一个信息和调用的信息不相等
     * 3.存在实例，并且相等，但是已经超出了限定的时间
     */
    if (
        !notifyMsgs.length ||
        notifyMsgs[notifyMsgs.length - 1].innerHTML != message ||
        checkIsTimeout()
    ) {
        dtNotification(title, message, type, icon, {
            style,
        });
    }
}

/**
 * 初始化notification
 */
export function initNotification() {
    notification.config({
        duration: 5,
    });
    const changeArr: Array<keyof NotificationInstance> = ['error', 'success'];
    const iconMap: any = {
        error: <CloseCircleOutlined />,
        success: <CloseCircleOutlined />,
    };
    changeArr.forEach((key: keyof NotificationInstance) => {
        const oldFunc: any = notification[key];
        notification[key] = function (config: any = {}) {
            const notifyMsgs = document.querySelectorAll('.ant-notification-notice-description');
            const newConfig = {
                ...config,
                icon: iconMap[key],
                className: 'dt-notification',
                message: (
                    <span>
                        {config.message}
                        {notifyMsgs.length ? null : (
                            <a
                                onClick={() => {
                                    notification.destroy();
                                }}
                                className="dt-notification__close-btn"
                            >
                                全部关闭
                            </a>
                        )}
                    </span>
                ),
            };
            oldFunc.apply(notification, [newConfig]);
        } as any;
    });
}

export function authAfterFormated(response: any) {
    // if (!response.code) return response;
    switch (response.code) {
        case 1:
            // case 10:
            return response;
        default:
            if (response.message) {
                singletonNotification('异常', response.message, 'error');
            }
            return response;
    }
}
