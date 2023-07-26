import { NotificationType } from "@/types";

/**
 * Hook for managing user notifications.
 * @todo Vanilla JS placeholder. Replace with actual React code.
 */
export function useNotification() {
  /**
   * @param message The message to display.
   * @param type The type of notification.
   * @param duration How long the notification should last, in ms.
   */
  return function notifyUser(
    message: string,
    type: NotificationType,
    duration = 3000,
  ) {
    return new Promise<void>((resolve) => {
      const notificationContainer: HTMLDivElement =
        document.querySelector(".app_notification_container") ??
          document.createElement("div");

      notificationContainer.className = "app_notification_container";
      const notification = (document.querySelector(".app_notification") ??
        document.createElement("div")) as unknown as (HTMLDivElement & {
          timeout?: number;
        });
      notification.className = `app_notification ${type}`;
      notification.innerText = message;

      notificationContainer.append(notification);

      document.body.prepend(notificationContainer);

      if (notification.timeout) {
        window.clearInterval(notification.timeout);
      }

      notification.timeout = setTimeout(() => {
        notification.animate({
          transform: "translateY(-30%)",
          opacity: "0",
        }, {
          direction: "normal",
          fill: "both",
          duration: 400,
        }).addEventListener("finish", () => {
          notification.timeout = undefined;
          notificationContainer.remove();
          resolve();
        });
      }, duration);
    });
  };
}
