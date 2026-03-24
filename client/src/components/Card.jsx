const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

export default Card;
