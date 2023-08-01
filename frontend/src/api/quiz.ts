import { CategoryResponse, RequestError } from "@/types";
import axios from ".";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

/**
 * Retrieves 20 questions for a category.
 * @route "/category/get/:id/:level"
 * @param id The category
 * @param level
 */
export const useGetCategoryQuestionsQuery = (id: number, level: number) => {
   const { data, isError, error } = useQuery({
      queryKey: ["get-category", id, level],
      queryFn: () =>
         axios
            .get<CategoryResponse>(`/category/get${id}/${level}`)
            .then((data) => data.data)
   });
   if (isError) {
      toast.error((error as RequestError).response?.data?.message);
   }
   return data;
};
