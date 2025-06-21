export enum NotificationType {
	Success = 'success',
	Error = 'error',
	Info = 'info',
	Warning = 'warning',
}

interface Notification {
	type: NotificationType;
	message: string;
}

export enum MethodType {
	Get = 'get',
	Post = 'post',
	Put = 'put',
	Delete = 'delete',
	Patch = 'patch',
}

export interface NotificationWithAction extends Notification {
	actionLabel: string;
	actionUrl: string;
	actionMethod: MethodType;
	actionBody?: Record<string, string>;
}

export type NotificationFlash = Notification | NotificationWithAction;
