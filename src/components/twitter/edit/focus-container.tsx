import React, { ReactNode } from 'react';
import { useFocus } from '@/components/onboarding/use-focus';

interface FocusMotionContainerProps {
  children: (props: {
    getClassName: (item: string, additionalClasses?: string) => string;
    handleFocus: (item: string) => () => void;
    handleBlur: () => void;
    focusedItem: string | null;
  }) => ReactNode;
  defaultClassName?: string;
  expandedWidth?: string;
  shrunkWidth?: string;
  equalWidth?: string;
  className?: string;
}

/**
 * A container component that provides focus motion effects to its children
 */
export function FocusContainer({
  children,
  defaultClassName = 'flex flex-col w-full',
  expandedWidth = '55%',
  shrunkWidth = '45%',
  equalWidth = '50%',
  className = 'md:flex md:flex-row md:gap-6 w-full'
}: FocusMotionContainerProps) {
  const focusMotion = useFocus<string>(
    defaultClassName,
    expandedWidth,
    shrunkWidth,
    equalWidth
  );

  return (
    <div className={className}>
      {children(focusMotion)}
    </div>
  );
}

/**
 * Usage example:
 * 
 * <FocusMotionContainer>
 *   {({ getClassName, handleFocus, handleBlur }) => (
 *     <>
 *       <div className={getClassName('field1', 'mb-6 md:mb-0')}>
 *         <Input 
 *           onFocus={handleFocus('field1')} 
 *           onBlur={handleBlur} 
 *         />
 *       </div>
 *       <div className={getClassName('field2')}>
 *         <Input 
 *           onFocus={handleFocus('field2')} 
 *           onBlur={handleBlur} 
 *         />
 *       </div>
 *     </>
 *   )}
 * </FocusMotionContainer>
 */ 