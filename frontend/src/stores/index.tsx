/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-this-alias */
import {
   ReactNode,
   RefObject,
   useEffect,
   useRef,
   useSyncExternalStore,
} from "react";
import { Modal } from "@/components/ui";
import { ModalProps } from "@/types";

interface ModalCloseOptions {
   /**
    * Whether or not to clear the modal content once it is closed.
    * @default false
    */
   keepAlive?: boolean;
}

interface ModalOpenOptions {
   // /**
   //  * Whether or not the modal should close if the user clicks outside it.
   //  * @default false
   //  */
   // closeOnClickOutside?: boolean;
   // /**
   //  * Whether or not the modal should impose a route change.
   //  * @default false
   //  */
   // routeChange?: string | boolean;
}

type ModalPropsUpdate = Partial<
   Exclude<ModalProps, "closeButtonRef" | "children" | "onClose">
>;

interface ModalManager {
   /**
    * The content of the modal.
    * Chnaging it is like setting state. Doing so in a component will lead to infinite renders.
    */
   data: ReactNode;
   /**
    * Opens a modal.
    * @param options Modal options.
    */
   open(options?: ModalOpenOptions): void;
   /**
    * Change the properties of the modal.
    */
   morph(props: ModalPropsUpdate): void;
   /** Force closes the modal. */
   close(options?: ModalCloseOptions): void;
}

/**
 * External store for modal management in the app.
 */
class ModalStore extends EventTarget {
   isOpen = false;
   private content = null as ReactNode;
   ref = null as RefObject<HTMLDivElement> | null;
   initialProps = {} as ModalPropsUpdate;
   props: ModalPropsUpdate;
   private manager: ModalManager;

   constructor() {
      super();
      const outerThis = this;
      this.props = this.initialProps;
      // Create a new modal manager.
      this.manager = {
         set data(value: ReactNode) {
            outerThis.content = value;
            if (outerThis.isOpen) {
               outerThis.update();
            }
         },
         get data() {
            return outerThis.content;
         },
         close(options) {
            outerThis.isOpen = false;
            if (!options?.keepAlive) {
               outerThis.content = null;
               outerThis.props = outerThis.initialProps;
            }
            outerThis.update();
         },
         open() {
            outerThis.isOpen = true;
            outerThis.update();
            // outerThis.closeOnOutsideClick =
            //    outerThis.closeOnOutsideClick.bind(modalStore);
            // window.addEventListener("click", outerThis.closeOnOutsideClick);
         },
         morph(props) {
            outerThis.props = props;
            if (outerThis.isOpen) {
               outerThis.update();
            }
         },
      };
   }
   /**
    * Triggers an external store update.
    */
   private update() {
      this.manager = { ...this.manager };
      this.dispatchEvent(new Event("update"));
   }

   /**
    * Listener for outer click events.
    */
   // private closeOnOutsideClick(event: MouseEvent) {
   //    const { target } = event as unknown as { target: HTMLDivElement };
   //    if (!(this.ref && target.contains(this.ref.current))) {
   //       this.manager.close();
   //       window.removeEventListener("click", this.closeOnOutsideClick);
   //    }
   // }

   /**
    * Required `subscribe()` function.
    * @param callback Function that should run when the store changes.
    * @returns An unsubscribe function.
    */
   subscribe(callback: () => void) {
      this.addEventListener("update", callback);
      return () => this.removeEventListener("update", callback);
   }

   /**
    * Required `getSnapshot()` function.
    * @returns A modal manager.
    */
   getSnapshot(): ModalManager {
      return this.manager;
   }
}

export const modalStore = new ModalStore();

interface ModalProviderProps {
   children: ReactNode;
}

/**
 * Wrapper for modal users.
 */
export function ModalProvider(props: ModalProviderProps) {
   const modalSnapshot = useSyncExternalStore(
      modalStore.subscribe.bind(modalStore),
      modalStore.getSnapshot.bind(modalStore)
   );
   const modalRef = useRef<HTMLDivElement>(null);
   const closeButtonRef = useRef<HTMLButtonElement>(null);

   useEffect(() => {
      modalStore.ref = modalRef;
   }, []);

   return (
      <>
         {modalStore.isOpen ? (
            <Modal
               ref={modalRef}
               closeButtonRef={closeButtonRef}
               onClose={() => modalSnapshot.close()}
               {...modalStore.props}
            >
               {modalSnapshot.data}
            </Modal>
         ) : (
            <></>
         )}
         {props.children}
      </>
   );
}
