// components/YouTubePlayer.js
import React from 'react';
import ReactPlayer from 'react-player/youtube';

const YouTubePlayer = ({ url }) => {
    return (
        <div className="w-full h-96">
            <ReactPlayer
                className="w-full h-full"
                url={url}
                width="100%"
                height="100%"
                controls
            />
        </div>
    );
};

export default YouTubePlayer;
