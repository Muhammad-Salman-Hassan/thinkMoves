import React from "react";

import {
  Tooltip as ChakraTooltip,
  Portal,
} from "@chakra-ui/react";
export const Tooltip = React.forwardRef(
    (
      {
        showArrow,
        children,
        disabled,
        portalled = true,
        content,
        contentProps,
        contentStyleProps,   // <-- new prop for style props
        portalRef,
        ...rest
      },
      ref
    ) => {
      if (disabled) return children;
  
      return (
        <ChakraTooltip.Root {...rest}>
          <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
          <Portal disabled={!portalled} container={portalRef}>
            <ChakraTooltip.Positioner>
              <ChakraTooltip.Content
                ref={ref}
                {...contentProps}
                {...contentStyleProps}     
              >
                {showArrow && (
                  <ChakraTooltip.Arrow>
                    <ChakraTooltip.ArrowTip />
                  </ChakraTooltip.Arrow>
                )}
                {content}
              </ChakraTooltip.Content>
            </ChakraTooltip.Positioner>
          </Portal>
        </ChakraTooltip.Root>
      );
    }
  );
  