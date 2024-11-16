import axios from "axios";
import {useQuery} from "@tanstack/react-query";

export const useGetData = (offset) => {
    const botKey = 'bot1298020317:AAHrgU__t5IPreTPsJCTgNIdylsioarMEMw'

    const queryFn = () => axios.post(`https://api.telegram.org/${botKey}/getUpdates`, {offset}).then((response) => response.data);
    return useQuery({
        queryKey: ['get-data-request', offset],
        enabled: true,
        refetchInterval: 60000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn
    })
}