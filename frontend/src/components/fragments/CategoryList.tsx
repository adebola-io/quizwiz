import { Category } from ".";

export function CategoryList() {
   return (
      <div>
         <h2 className="font-avenir-next-lt-pro-bold text-[1.4965rem] max-[720px]:text-[2rem] mb-3 text-green-charcoal">
            Categories
         </h2>
         <div className="flex items-center max-[912px]:flex-wrap justify-between max-[912px]:justify-center max-[768px]:justify-between">
            <Category
               name="Random Quiz"
               className="animate-pull-from-bottom effect-item-0"
            />
            <Category
               name="Mathematics"
               className="animate-pull-from-bottom effect-item-1"
            />
            <Category
               name="Language & Literature"
               className="animate-pull-from-bottom effect-item-2"
            />
            <Category
               name="History, Politics & Geography"
               className="animate-pull-from-bottom effect-item-3"
            />
            <Category
               name="Sports"
               className="animate-pull-from-bottom effect-item-4"
            />
            <Category
               name="Technology"
               className="animate-pull-from-bottom effect-item-5"
            />
            <Category
               name="Pop Culture"
               className="animate-pull-from-bottom effect-item-6"
            />
         </div>
      </div>
   );
}
