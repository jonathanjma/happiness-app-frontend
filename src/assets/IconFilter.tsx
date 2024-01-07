import { SVGProps } from 'react';

export default function IconFilter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18V16H14V18H10ZM6 13V11H18V13H6ZM3 8V6H21V8H3Z" fill={props.color} />
    </svg>
  );
}
