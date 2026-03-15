// components/StarRating.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";

export default function StarRating({ rating = 0, maxStars = 5 }) {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (rating >= i) {
      stars.push(
        <FontAwesomeIcon key={i} icon={solidStar} className="text-[#E50913]" />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStarHalfAlt}
          className="text-[#E50913]"
        />
      );
    } else {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={regularStar}
          className="text-[#E50913]"
        />
      );
    }
  }

  return <div className="flex space-x-1">{stars}</div>;
}
