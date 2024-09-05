import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type VariantProps } from "class-variance-authority"



interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ onClick, variant = 'default', size = 'default', className, asChild = false, ...props }, ref) => {
    return (
      <Button
        onClick={onClick}
        {...props}
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
            buttonVariants({ variant, size, className }),
            'fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full shadow-lg transition-colors duration-300 z-50',
        )}
      />
    );
  }
);

FloatingButton.displayName = 'FloatingButton';

export { FloatingButton };
