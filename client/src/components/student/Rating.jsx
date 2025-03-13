// import React, { useEffect, useState } from 'react'

// const Rating = ({initialRating, onRate}) => {



//   const[rating,setRating] = useState(initialRating || 0)


//   const handleRating = (value) => {
//     setRating(value);
//     if(onRate) onRate(value)
//   }


//   useEffect(()=>{
//     if(initialRating){
//       setRating(initialRating)
//     }
//   },[initialRating]);


//   return (
//     <div>
//       {Array.from({length: 5}, (_,index)=>{
//         const starValue = index + 1 ;
//         return (
//           <span key={index} className={`text-xl sm:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-500' : 'text-gray-400'}`}
//           onClick={()=>handleRating(starValue)}>
//             &#9733;
//           </span>
//         )
//       })}
//     </div>
//   )
// }

// export default Rating
import React, { useEffect, useState } from 'react';

const Rating = ({ initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex gap-1 sm:gap-2">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`text-2xl sm:text-3xl cursor-pointer transition-all duration-300 
              ${starValue <= (hoverRating || rating) ? 'text-yellow-400 drop-shadow-lg scale-110' : 'text-gray-400'}
              hover:text-yellow-300 hover:scale-125`}
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
