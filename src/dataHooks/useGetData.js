import axios from "axios";
import {useQuery} from "@tanstack/react-query";

export const useGetData = () => {
    const botKey = 'bot1298020317:AAHrgU__t5IPreTPsJCTgNIdylsioarMEMw'

    const queryFn = () => axios.post(`https://api.telegram.org/${botKey}/getUpdates`).then((response) => response.data);
    return useQuery({
        queryKey: ['get-data-request'],
        enabled: true,
        refetchInterval: 60000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn
    })
}