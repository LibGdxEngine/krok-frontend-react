/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
        },
        fontFamily: {
            Poppins: " 'Poppins', sans-serif",
        },
        extend: {
            animation: {
                'flow-0': 'flow-0 4s ease-in-out infinite',
                'flow-1': 'flow-1 5s ease-in-out infinite',
                'flow-2': 'flow-2 6s ease-in-out infinite',
                'flow-3': 'flow-3 7s ease-in-out infinite',
            },
            keyframes: {
                'flow-0': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-30px)' },
                },
                'flow-1': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-30px)' },
                },
                'flow-2': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-30px)' },
                },
                'flow-3': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-30px)' },
                },
            },
            fontSize: {
                "2xs": "0.625rem",
            },
            colors: {
                dark: "#11181D",
                black: "#444545",
                darkBlue: "#07003D",
                ldarkBlue: "#3F72B2",
                numbersBlue: "#7AA9E4",
                customBlue: "#0073D1",
                searchColor: "#4E8CDB",
                lightDark: "#00000066",
                light: "#ffffff",
                primary: "#00263A", // 240,86,199
                primaryDark: "#8A959E26", // 80,230,217,
                navyBlue: "#4E8CDB",
                darkGreen: "#137054",
                midGreen: "#4F9D5D",
                lightGreen: "#7FCE7A",
                mintyGreen: "#EFFFEE",
                mildGray: "#808080",
                lightGray: "#EFEFEF",
                greenCard: "#56B794",
                mOrange: "#FFC859",
                mRed: "#FF3B30",
            },
            screens: {
                ms: "400px",

                "2xl": {max: "1535px"},
                // => @media (max-width: 1535px) { ... }

                xl: {max: "1279px"},
                // => @media (max-width: 1279px) { ... }

                lg: {max: "1023px"},
                // => @media (max-width: 1023px) { ... }

                md: {max: "767px"},
                // => @media (max-width: 767px) { ... }

                sm: {max: "639px"},
                // => @media (max-width: 639px) { ... }

                xs: {max: "479px"},
                // => @media (max-width: 479px) { ... }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                plans: "linear-gradient(32deg, #56B794 0%, #137054 100%)",
            },
            boxShadow: {
                1: "0px 15px 20px 0px rgba(0, 0, 0, 0.10) ",
                2: "0px 15px 30px 0px rgba(0, 0, 0, 0.10)",
                3: "0px 0px 100px 0px rgba(127, 206, 122, 0.40)",
                4: "-25px 25px 100px 0px rgba(127, 206, 122, 0.50)",
                5: "-100px 100px 150px 0px rgba(54, 180, 140, 0.20)",
                6: "0px 14px 35px 0px rgba(54, 180, 140, 0.40)",
                7: " -75px 75px 150px 0px #137054",
            },
            borderRadius: {
                5: "5px",
                8: "8.56px",
                10: "10px",
                35: "35px",
            },
            spacing: {
                '0': '0',
                // Add this to remove default margin from all divs
            }
        },
    },
    plugins: [
        require('@tailwindcss/aspect-ratio'),
    ],
};
