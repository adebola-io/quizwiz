import "./Notification.css";

interface NotificationProps {
   type: "error" | "success" | "info";
   message: string;
   duration?: number;
}

/**
 * A simple alert.
 * @todo
 */
export function Notification(props: NotificationProps) {
   return <div>{props.message}</div>;
}
