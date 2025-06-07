import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * Card: contenitore riutilizzabile con bordo, ombra e padding.
 */
export const Card: React.FC<CardProps> = ({ className = '', children, ...props }) => {
  return (
    <div
      className={
        'rounded-2xl border border-gray-200 bg-white shadow-md p-4 ' + className
      }
      {...props}
    >
      {children}
    </div>
  );
};
Card.displayName = 'Card';

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const CardHeader: React.FC<CardHeaderProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={'mb-2 text-lg font-semibold ' + className} {...props}>
      {children}
    </div>
  );
};
CardHeader.displayName = 'CardHeader';

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}
export const CardTitle: React.FC<CardTitleProps> = ({ className = '', children, ...props }) => {
  return (
    <h3 className={'text-xl font-bold ' + className} {...props}>
      {children}
    </h3>
  );
};
CardTitle.displayName = 'CardTitle';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const CardContent: React.FC<CardContentProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={'text-sm text-gray-800 ' + className} {...props}>
      {children}
    </div>
  );
};
CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export const CardFooter: React.FC<CardFooterProps> = ({ className = '', children, ...props }) => {
  return (
    <div className={'mt-4 border-t pt-2 ' + className} {...props}>
      {children}
    </div>
  );
};
CardFooter.displayName = 'CardFooter';
