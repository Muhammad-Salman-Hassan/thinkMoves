"use client";

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react";

export const toaster = createToaster({
  placement: "bottom",
  pauseOnPageIdle: true,
});

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          
          const getDescription = () => {
            if (!toast.description) return null;
            
            if (typeof toast.description === 'string') {
              return toast.description;
            }
            
            if (typeof toast.description === 'object') {
             
              if (toast.description.setUserNameresponse) {
                return toast.description.setUserNameresponse;
              }
              if (toast.description.message) {
                return toast.description.message;
              }
              if (toast.description.errors && Array.isArray(toast.description.errors)) {
                return toast.description.errors.join(', ') || 'An error occurred';
              }
             
              return JSON.stringify(toast.description);
            }
            
            // Fallback for other types
            return String(toast.description);
          };

          const description = getDescription();

          return (
            <Toast.Root width={{ md: "sm" }}>
              {toast.type === "loading" ? (
                <Spinner size="sm" color="blue.solid" />
              ) : (
                <Toast.Indicator />
              )}
              <Stack gap="1" flex="1" maxWidth="100%">
                {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                {description && (
                  <Toast.Description>{description}</Toast.Description>
                )}
              </Stack>
              {toast.action && (
                <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
              )}
              {toast.closable && <Toast.CloseTrigger />}
            </Toast.Root>
          );
        }}
      </ChakraToaster>
    </Portal>
  );
};