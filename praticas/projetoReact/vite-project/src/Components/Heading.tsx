type HeadingProps = {
children: React.ReactNode; // Inicialmente, dizemos que children será apenas texto
};
export function Heading({children}: HeadingProps) {
  return <h1>{children}</h1>
} 