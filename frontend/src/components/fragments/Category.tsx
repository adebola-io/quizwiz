interface CategoryProps {
   name?: string;
   icon: React.ReactNode;
   id: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * A category box.
 */
export function Category(props: CategoryProps) {
   return (
      <div>
         <div>{props.icon}</div>
         <span>{props.name}</span>
      </div>
   );
}
