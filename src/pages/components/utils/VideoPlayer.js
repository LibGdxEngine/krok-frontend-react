// Component.jsx
const VideoPlayer = () => (
    
    <div id="home-video" className="w-full sm:w-screen bg-light h-full flex justify-center">
        <div className="aspect-w-16 aspect-h-9 w-full">
            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/CjcRacjsmYY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    </div>
);

export default VideoPlayer;
