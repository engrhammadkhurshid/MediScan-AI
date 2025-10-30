import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M16 0V16H0" stroke="#4285F4" strokeWidth="4"/>
      <path d="M16 32V16H0" stroke="#0F9D58" strokeWidth="4"/>
      <path d="M16 0V16H32" stroke="#DB4437" strokeWidth="4"/>
      <path d="M16 32V16H32" stroke="#F4B400" strokeWidth="4"/>
      <rect x="13" y="13" width="6" height="6" fill="hsl(var(--background))" />
    </svg>
  )
}
