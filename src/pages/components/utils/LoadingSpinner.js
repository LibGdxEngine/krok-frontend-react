// components/LoadingSpinner.js
const LoadingSpinner = () => {
    return (
        <div className="w-full flex items-center justify-center ">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

export default LoadingSpinner;
