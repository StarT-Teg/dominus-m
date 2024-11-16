import {forwardRef, useEffect, useState} from 'react'
import './App.css'
import FlipMove from "react-flip-move";
import {useGetData} from "./dataHooks/useGetData.js";


const SongLine = forwardRef(({songName, position, rating}, ref) => {
    const songAvatarUrl = `${import.meta.env.BASE_URL}/${songName.toLowerCase().replaceAll(' ', '_')}.webp`

    return (<div className={'songLine'} ref={ref}>
        <div className={'songLinePosition'}>{position}</div>
        <div className={'songLineName'}>
            <img src={songAvatarUrl} className={'songLineAvatar'} loading={'lazy'} onError={(e) => {
                e.target.onError = null;
                e.target.src = `${import.meta.env.BASE_URL}/vite.svg`
            }} alt=""/>
            {songName}
        </div>
        <div className={'songLineRating'}>{rating}</div>
    </div>)

});

const getSongNameFromText = (text) => {
    if (!text) {
        return;
    }

    return text.match(new RegExp(/".*"/gmi, 'gmi'))?.[0].slice(1, -1).trim();
}

function App() {

    const MOCK_RATING = {
        'Ancient Machines': [4, 6, 6, 8, 6.43, 7, 8, 7, 8, 6, 8, 6, 7, 6],
        'City Colors': [8, 5.55, 8, 8.5, 7, 5, 7, 7, 5, 8, 7, 8, 7, 6],
        Firefly: [10, 10, 7, 8, 7.5, 6, 10, 10, 6.66, 8, 8, 10, 9, 9, 6, 8],
        'League of Downwire': [7.5,5,5,6,6,8,7,7,6,6,7.77,7,5,5],
        'Low Level Zone': [8,6,7.5,7,6,6,9,9.89,9,4,7,5,7,8,9],
        'Reapers Squad': [6,9,8,6,7,8,10,10,7,10,8,6,9.99,10,7],
        'Red Light': [9,7,9.99,10,4,8,8,7,6,5,9,5,6,6,5],
        'Show Me The Way': [10,10,5,9,4,5,6,8,8,8,7,10,10,10,10,8],
        'The Chase': [7,10,10,8.5,6,5,8.8,6,6,5,7,5,7,8],
        'This Is Not The End': [6,10,8,9,8,9,7,5,9,9.2,6,8,7.77,7,10]
    }

    const [offset, setOffset] = useState(-1)
    const {data, refetch} = useGetData(offset);
    const [commentsData, setCommentsData] = useState({});
    const songListInitialOrder = Object.keys(MOCK_RATING || {})
    const [sortType, setSortType] = useState('songNumber');
    const [songList, setSongList] = useState([])

    // useEffect(() => {
    //     setCommentsData((prevState => (
    //         {...data?.result?.reduce((acc, updateData) => {
    //
    //                 const message = updateData?.edited_message || updateData?.message
    //
    //                 if (!!message?.reply_to_message) {
    //                     const songName = getSongNameFromText(message?.reply_to_message?.text || message?.reply_to_message?.caption);
    //                     const senderName = message?.from?.first_name || message?.from?.username || '';
    //                     let rating = message?.text?.replaceAll(',', '.').replace(/[^0-9.]/g, '');
    //
    //                     if (!songName) {
    //                         return acc;
    //                     }
    //
    //                     if (!Number.isNaN(rating)) {
    //                         const ratingFormatted = Number(rating);
    //                         if (ratingFormatted > 10) {
    //                             rating = 10;
    //                         } else if (ratingFormatted < 0) {
    //                             rating = 0;
    //                         } else {
    //                             rating = ratingFormatted;
    //                         }
    //                     } else {
    //                         return acc;
    //                     }
    //
    //                     return {
    //                         ...acc, [songName]: {
    //                             ...acc?.[songName], [senderName]: rating,
    //                         }
    //                     }
    //                 }
    //
    //                 return acc;
    //             }, {...prevState})}
    //     )))
    //
    //     if (data?.result?.length >= 100) {
    //         setOffset(data?.result?.[99]?.update_id + 1)
    //     }
    // }, [data])

    useEffect(() => {

        const newSongList = Object.keys(MOCK_RATING)

        if (sortType === 'rating') {
            setSongList(newSongList.sort((songNameA, songNameB) => {
                const a = Object.values(MOCK_RATING[songNameA]).reduce((acc, rate) => acc + rate, 0) / MOCK_RATING[songNameA].length;
                const b = Object.values(MOCK_RATING[songNameB]).reduce((acc, rate) => acc + rate, 0) / MOCK_RATING[songNameB].length;

                return b - a;
            }))
        } else {
            setSongList(newSongList);
        }

        // if (!commentsData) {
        //     return;
        // } else {
        //     const newSongList = Object.keys(commentsData)
        //
        //     if (sortType === 'rating') {
        //         setSongList(newSongList.sort((songNameA, songNameB) => {
        //             const a = Object.values(commentsData[songNameA]).reduce((acc, rate) => acc + rate, 0);
        //             const b = Object.values(commentsData[songNameB]).reduce((acc, rate) => acc + rate, 0);
        //
        //             return b - a;
        //         }))
        //     } else {
        //         setSongList(newSongList);
        //     }
        // }

    }, [commentsData, sortType])

    return (
        <>
            <div className={'background'}
                 style={{backgroundImage: `${import.meta.env.BASE_URL}/image_2024-10-24_22-40-36.png`}}/>
            <div className={'root'}>
                <div className={'songListHeader'}>
                    <div style={{padding: '0 10px', cursor: 'pointer'}} onClick={() => {
                        setSortType('songNumber')
                    }}>#
                    </div>
                    <div>Song</div>
                    <div style={{cursor: 'pointer'}} onClick={() => {
                        setSortType('rating')
                    }}>Rating
                    </div>
                </div>
                <FlipMove className={'songList'}>
                    {songList.map((songName) => {
                        const songPosition = songListInitialOrder.findIndex((songNameFromList => songNameFromList === songName)) + 1
                        const ratingList = MOCK_RATING[songName]
                        const averageRating = ratingList.reduce((acc, rating) => acc + Number(rating), 0) / ratingList.length
                        const ratingRound = Math.round((averageRating + Number.EPSILON) * 100) / 100

                        return (
                            <SongLine songName={songName} position={songPosition} key={songName} rating={ratingRound}/>)
                    })}
                </FlipMove>
                <div className={'refreshIcon'} onClick={() => {
                    refetch()
                }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlSpace="preserve"
                        width={30}
                        height={30}
                        viewBox="0 0 48.117 48.117"
                        fill={'#2B2B2B'}
                    >
                        <path
                            d="M30.621 4.122a22.982 22.982 0 0 0-9.418-2.018c-2.651 0-5.295.482-7.826 1.399L10.76.586c-.842-.938-1.841-.727-2.231.472L4.014 14.88c-.391 1.196.291 1.955 1.523 1.697l14.228-3c1.232-.261 1.55-1.232.708-2.167L18.49 9.198c3.13-.532 6.379-.16 9.33 1.165a16.05 16.05 0 0 1 8.485 8.998 16.048 16.048 0 0 1-.362 12.36 16.045 16.045 0 0 1-8.997 8.485 16.073 16.073 0 0 1-12.361-.36l-1.401 3.121c-.774 1.721.46 4.006 2.914 4.571 4.39 1.008 8.978.699 13.281-.936 5.743-2.188 10.291-6.478 12.807-12.08a22.845 22.845 0 0 0 .514-17.596A22.846 22.846 0 0 0 30.621 4.122z"/>
                    </svg>
                </div>
            </div>
        </>
    )
}

export default App
