// src/components/home/TopStudentsThisMonth.jsx
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image'; // Use Next.js Image component

// Define rank styles - using Tailwind arbitrary values for more control
const rankStyles = {
  1: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-yellow-900 border-yellow-500 shadow-lg shadow-yellow-500/30', // Gold
  2: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-900 border-gray-500 shadow-lg shadow-gray-500/30',   // Silver
  3: 'bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 text-orange-900 border-orange-500 shadow-lg shadow-orange-500/30', // Bronze
  default: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 text-blue-900 border-blue-500 shadow-md shadow-blue-500/20',     // Default (Steel Blue gradient)
};

const getRankStyle = (rank) => {
  return rankStyles[rank] || rankStyles.default;
};

// Example mock data (replace with your actual data fetching logic)
const topStudentsData = [
    { id: 1, rank: 1, name: 'Alice Wonder', score: 1520, imageUrl: 'https://images.unsplash.com/photo-1580034283351-073a1906f7ba?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, rank: 2, name: 'Bob Builder', score: 1485, imageUrl: 'https://images.unsplash.com/photo-1519400197429-404ae1a1e184?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVua25vd258ZW58MHx8MHx8fDA%3D' },
    { id: 3, rank: 3, name: 'Charlie C', score: 1450, imageUrl: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW5rbm93bnxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 4, rank: 4, name: 'Diana Prince', score: 1390, imageUrl: 'https://images.unsplash.com/photo-1534294668821-28a3054f4256?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dW5rbm93bnxlbnwwfHwwfHx8MA%3D%3D' },
    { id: 5, rank: 5, name: 'Ethan Hunt', score: 1355, imageUrl: 'https://images.unsplash.com/photo-1566711740973-4c93d1d9f160?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVua25vd258ZW58MHx8MHx8fDA%3D' },
    { id: 6, rank: 6, name: 'Fiona Shrek', score: 1320, imageUrl: 'https://images.unsplash.com/photo-1612386548092-710c4162f63f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHVua25vd258ZW58MHx8MHx8fDA%3D' },
    // Add more if needed
];

// Animation Variants (can remain the same)
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // Adjust stagger timing if needed for grid
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 }, // Changed animation slightly for grid pop-in
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 10
    },
  },
};


const TopStudentsThisMonth = ({ maxStudents = 6 }) => { // Adjust default based on grid layout
  const [currentMonthYear, setCurrentMonthYear] = React.useState('');
  React.useEffect(() => {
      if (typeof window !== 'undefined') {
          setCurrentMonthYear(
              new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
          );
      }
  }, []);

  const studentsToShow = topStudentsData.slice(0, maxStudents);

  return (
    // Changed section max-width for potentially wider grid display
    <section className="w-full max-w-4xl mx-auto my-10 p-4 sm:p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-2xl shadow-xl border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        Top Students - {currentMonthYear || 'This Month'}
      </h2>

      {studentsToShow.length > 0 ? (
        // Use motion.div with grid classes instead of motion.ol
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4" // Responsive grid layout
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {studentsToShow.map((student, index) => (
            // Use motion.div for grid items instead of motion.li
            <motion.div
              key={student.id}
              className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 transition-shadow duration-300 hover:shadow-xl overflow-hidden" // Adjusted layout: flex-col, items-center, text-center
              variants={itemVariants}
              whileHover={{
                 scale: 1.05, // Slightly larger hover scale for cards
                 boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)", // Enhanced shadow on hover
                 transition: { duration: 0.2 }
                }}
            >
              {/* Rank Badge - Placed above the image */}
              <div
                className={`relative mt-4 mb-2 flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-bold text-lg sm:text-xl ${getRankStyle(student.rank)}`}
                // Added negative margin to slightly overlap the top edge
              >
                {student.rank}
              </div>

              {/* Profile Image */}
              <div className="flex-shrink-0 mb-3"> {/* Added margin below image */}
                 <Image
                    src={student.imageUrl}
                    alt={`${student.name}'s profile picture`}
                    width={80} // Increased size slightly for grid card
                    height={80}
                    className="rounded-full object-cover border-4 border-white shadow-md" // Added white border for separation
                 />
              </div>

              {/* Student Info */}
              <div className="flex-grow min-w-0">
                <p className="text-lg sm:text-xl font-semibold text-gray-800 truncate px-2" title={student.name}> {/* Added padding for truncate */}
                  {student.name}
                </p>
                <p className="text-base sm:text-lg text-purple-600 font-medium mt-1"> {/* Added margin top */}
                  {student.score} Points
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
          <p className="text-center text-gray-500 mt-4">Leaderboard data is not available yet.</p>
      )}
    </section>
  );
};

export default TopStudentsThisMonth;