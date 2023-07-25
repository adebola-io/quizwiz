interface NotificationProps {
   type: "error" | "success" | "info";
   message: string;
}

/**
 * A simple alert.
 */
export function Notification(props: NotificationProps) {
   return <div>{props.message}</div>;
}
