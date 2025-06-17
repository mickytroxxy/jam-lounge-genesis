import { RootState } from "@/store";
import { useSelector } from "react-redux";

export const useSecrets = () => {
    const {secrets} = useSelector((state: RootState) => state.globalVariables);
    return {secrets}
}