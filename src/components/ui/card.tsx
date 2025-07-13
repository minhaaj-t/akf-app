import React from "react";

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`rounded-lg shadow bg-white border ${className}`}>{children}</div>
);

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ className = "", children }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
