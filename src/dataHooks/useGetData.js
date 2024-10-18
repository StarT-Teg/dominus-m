import axios from "axios";
import {useQuery} from "@tanstack/react-query";

export const useGetData = () => {
    const botKey = 'bot1298020317:AAHrgU__t5IPreTPsJCTgNIdylsioarMEMw'
    const chatId = '-1002394078163'

    const queryFn = () => axios.post(`https://api.telegram.org/${botKey}/getUpdates`, {
        chat_id: chatId
    }).then((response) => response.data);
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