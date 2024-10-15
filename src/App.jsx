import {forwardRef, useEffect, useState} from 'react'
import './App.css'
import axios from "axios";
import FlipMove from "react-flip-move";


const SongLine = forwardRef(({songName, position, rating}, ref) => {
    const songAvatarUrl = `${import.meta.env.BASE_URL}/${songName.toLowerCase().replaceAll(' ', '_')}.png`

    return (
        <div className={'songLine'} ref={ref}>
            <div className={'songLinePosition'}>{position}</div>
            <div className={'songLineName'}>
                <img src={songAvatarUrl} className={'songLineAvatar'} onError={(e) => {
                    e.target.onError = null;
                    e.target.src = `${import.meta.env.BASE_URL}/vite.svg`
                }} alt=""/>
                {songName}
            </div>
            <div className={'songLineRating'}>{rating}</div>
        </div>
    )

});

const getSongNameFromText = (text) => {
    if (!text) {
        return;
    }

    return text.match(new RegExp(/".*"/gmi, 'gmi'))?.[0].slice(1, -1).trim();
}

function App() {
    const [commentsData, setCommentsData] = useState();
    const songListInitialOrder = Object.keys(commentsData || {})
    const [sortType, setSortType] = useState('songNumber');
    const [songList, setSongList] = useState([])

    const getUpdates = () => {
        const botKey = import.meta.env.VITE_BOT_KEY
        const chatId = import.meta.env.VITE_CHAT_ID
        console.log('botKey:', botKey)
        axios.post(
            `https://api.telegram.org/${botKey}/getUpdates`,
            {
                chat_id: chatId
            }
        ).then(response => setCommentsData(response.data?.result?.reduce((acc, updateData) => {

            const message = updateData?.edited_message || updateData?.message

            if (!!message?.reply_to_message) {
                const songName = getSongNameFromText(message?.reply_to_message?.text);
                const senderName = message?.from?.first_name || message?.from?.username || '';
                let rating = message?.text?.replaceAll(',', '.').replace(/[^0-9.]/g, '');

                if (!Number.isNaN(rating)) {
                    const ratingFormatted = Number(rating);
                    if (ratingFormatted > 10) {
                        rating = 10;
                    } else if (ratingFormatted < 0) {
                        rating = 0;
                    } else {
                        rating = ratingFormatted;
                    }
                } else {
                    return acc;
                }

                return {
                    ...acc,
                    [songName]: {
                        ...acc?.[songName],
                        [senderName]: rating,
                    }
                }
            }

            return acc;
        }, {}))).catch((error) => console.log('error:', error))
    }

    useEffect(() => {

        if (!commentsData) {
            return;
        }

        const newSongList = Object.keys(commentsData)

        if (sortType === 'rating') {
            setSongList(newSongList.sort((songNameA, songNameB) => {
                const a = Object.values(commentsData[songNameA]).reduce((acc, rate) => acc + rate, 0);
                const b = Object.values(commentsData[songNameB]).reduce((acc, rate) => acc + rate, 0);

                return b - a;
            }))
        } else {
            setSongList(newSongList);
        }

    }, [commentsData, sortType])

    return (
        <div className={'root'}>
            <div className={'songList'}>
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

                <FlipMove typeName={null}>
                    {songList.map((songName) => {
                        const songPosition = songListInitialOrder.findIndex((songNameFromList => songNameFromList === songName)) + 1
                        const ratingList = Object.keys(commentsData[songName])
                        const averageRating = ratingList.reduce((acc, senderName) => acc + commentsData[songName][senderName], 0) / ratingList.length
                        const ratingRound = Math.round((averageRating + Number.EPSILON) * 100) / 100

                        return (
                            <SongLine songName={songName} position={songPosition} key={songName} rating={ratingRound}/>
                        )
                    })}
                </FlipMove>

            </div>
            <div className={'refreshIcon'} onClick={getUpdates}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    width={30}
                    height={30}
                    viewBox="0 0 48.117 48.117"
                    fill={'#2B2B2B'}
                >
                    <path d="M30.621 4.122a22.982 22.982 0 0 0-9.418-2.018c-2.651 0-5.295.482-7.826 1.399L10.76.586c-.842-.938-1.841-.727-2.231.472L4.014 14.88c-.391 1.196.291 1.955 1.523 1.697l14.228-3c1.232-.261 1.55-1.232.708-2.167L18.49 9.198c3.13-.532 6.379-.16 9.33 1.165a16.05 16.05 0 0 1 8.485 8.998 16.048 16.048 0 0 1-.362 12.36 16.045 16.045 0 0 1-8.997 8.485 16.073 16.073 0 0 1-12.361-.36l-1.401 3.121c-.774 1.721.46 4.006 2.914 4.571 4.39 1.008 8.978.699 13.281-.936 5.743-2.188 10.291-6.478 12.807-12.08a22.845 22.845 0 0 0 .514-17.596A22.846 22.846 0 0 0 30.621 4.122z" />
                </svg>
            </div>
        </div>
    )
}

export default App
