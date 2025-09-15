'use client';

import { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function CardSection({ title, children, className = '' }: Props) {
  return (
    <section className={`mb-6 p-4 border rounded bg-gray-50 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-700 mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
