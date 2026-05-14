"use client";

import React, { useEffect, useState } from 'react';
import PhoneInput, { Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from '@/lib/utils';

interface BOSSPhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function BOSSPhoneInput({ value, onChange, className, placeholder }: BOSSPhoneInputProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country>('CM');

  useEffect(() => {
    // IP Detection for country
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_code) {
          setDefaultCountry(data.country_code);
        }
      })
      .catch(() => {
        // Fallback already set to CM
      });
  }, []);

  return (
    <div className={cn("boss-phone-input", className)}>
      <PhoneInput
        international
        countryCallingCodeEditable={false}
        defaultCountry={defaultCountry}
        value={value}
        onChange={(val) => onChange(val || '')}
        placeholder={placeholder}
        className="flex items-center gap-2"
        numberInputProps={{
          className: "w-full bg-transparent border-none focus:ring-0 text-base font-medium text-gray-900 dark:text-white placeholder:text-gray-400 h-full"
        }}
      />
      <style jsx global>{`
        .boss-phone-input .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        .boss-phone-input .PhoneInputCountry {
          margin-right: 12px;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.05);
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .dark .boss-phone-input .PhoneInputCountry {
          background: rgba(255, 255, 255, 0.05);
        }
        .boss-phone-input .PhoneInputCountrySelect {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .boss-phone-input .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        .boss-phone-input .PhoneInputCountryIcon--border {
          background-color: transparent;
          box-shadow: none;
        }
        .boss-phone-input .PhoneInputCountrySelectArrow {
          margin-left: 6px;
          width: 0.4em;
          height: 0.4em;
          border-left: 1px solid currentColor;
          border-bottom: 1px solid currentColor;
          transform: rotate(-45deg);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
