import React from "react";

interface FormattedAmountProps {
  amount: number;
  currency?: string;
  className?: string;
  centsClassName?: string;
  currencyClassName?: string;
}

export function formatAmountParts(amount: number) {
  const parts = amount.toFixed(2).split(".");
  const integerPart = parts[0];
  const cents = parts[1];

  const groups = [];
  let temp = integerPart;
  while (temp.length > 3) {
    groups.unshift(temp.slice(-3));
    temp = temp.slice(0, -3);
  }
  groups.unshift(temp);

  let formatted = "";
  if (groups.length >= 2) {
    formatted = groups.join(".");
  } else {
    formatted = groups[0];
  }
  
  return { integer: formatted, cents };
}

export const FormattedAmount: React.FC<FormattedAmountProps> = ({ 
  amount, 
  currency = "XAF", 
  className = "", 
  centsClassName = "text-[0.6em] opacity-80 ml-0.5",
  currencyClassName = "text-[0.6em] uppercase ml-1 opacity-80"
}) => {
  const { integer, cents } = formatAmountParts(amount);
  const isStrikethrough = className.includes("line-through");
  const cleanClassName = className.replace("line-through", "");
  
  return (
    <span className={`inline-flex items-baseline font-black tracking-tight ${cleanClassName}`}>
      <span className="relative flex items-baseline">
        <span className="relative">
          {integer}
        </span>
        {cents !== "00" && (
          <span className={centsClassName}>
            <span className="opacity-80">,</span>
            {cents}
          </span>
        )}
        {isStrikethrough && (
          <span className="absolute left-0 right-0 top-[55%] h-[1.5px] bg-current opacity-60 -translate-y-1/2 pointer-events-none" />
        )}
      </span>
      {currency && (
        <span className={currencyClassName}>{currency}</span>
      )}
    </span>
  );
};
