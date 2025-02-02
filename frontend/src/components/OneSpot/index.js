import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { getOneSpot, deleteSpot } from "../../store/spots";
import { getAllReviews, addReview, deleteReview } from "../../store/review";
import Reviews from "../Reviews";
import SpotMap from "../SpotMap";
import './onespot.css'


function OneSpot() {
    const {spotId} = useParams()
    const dispatch = useDispatch()
    const oneSpot = useSelector(state => state?.spots[spotId])
    const reviews = useSelector(state => state?.reviews?.list)
    const sessionUser = useSelector(state => state?.session?.user)
    const history = useHistory()

    useEffect(() => {
        dispatch(getOneSpot(spotId))
        dispatch(getAllReviews(spotId))
    },[spotId, dispatch])

    console.log('kdkdkdkd', reviews)

    function avgStars(){
        let sum = 0
        for(let i = 0; i < reviews?.length; i++){
            let num = reviews[i]?.rating
            sum += num;
        }
        return `${Number.parseFloat(sum / reviews?.length).toFixed(1)}`
    }


    const deleteBtn = async (e) => {
        e.preventDefault()
        let deleteSpotRes;
        try {
            deleteSpotRes = await dispatch(deleteSpot(oneSpot,spotId));
        } catch (error) {
            throw new Error("Error - Resource not found")
        }
        if (deleteSpotRes.message === "Delete Successful") {
            history.push("/spots")
        }
    }

    return (
        <div className='spot-detail'>
            <div className="one-spot-title">
                <h1 id='title-one-spot'>{oneSpot?.title}</h1>
            </div>
            <div className="address-div-one-spot">
                <p id='city-one-spot'>{`${oneSpot?.city}, `}</p>
                <p id='state-one-spot'>{`${oneSpot?.state}, `}</p>
                <p id='country-one-spot'>{`${oneSpot?.country}`}</p>
            </div>
            <div className="image-div-one-spot">
                <img className="spot-image" src={oneSpot?.Images[0]?.url} alt="cabin" />
                <br />
            </div>
            <div className="edit-delete-div-one">
                {sessionUser?.id === oneSpot?.userId &&
                <>
                    <Link to={`/spots/${spotId}/host`}>Edit Spot</Link>
                    <button id='delete-one-spot' onClick={deleteBtn}>Delete</button>
                </>
                }
            </div>
            <div className="host-one-spot">
                <h2 className="h2-host-name">Hosted By: {oneSpot?.User?.username}</h2>
            </div>
            <div className="guest-bed-bath-one-spot">
                <p id='guests-one'>{`${oneSpot?.guests}`}</p>
                <p>{(oneSpot?.guests > 1 ? 'guests' : 'guest')}</p>
                <span className="bullet-point-one-spot">∙</span>
                <p id='beds-one'>{`${oneSpot?.beds}`}</p>
                <p>{(oneSpot?.beds > 1 ? 'bedrooms' : 'bedroom')}</p>
                <span className="bullet-point-one-spot">∙</span>
                <p id='baths-one'>{`${oneSpot?.baths}`}</p>
                <p>{(oneSpot?.baths > 1 ? 'baths' : 'bath')}</p>
                <h3 id='cost-one-spot'>{`$${oneSpot?.costPerNight}/Night`}</h3>
            </div>
            <div className="line-one-spot"></div>
            <h3 id='entire-home'><i class="fas fa-home"></i> Entire Home</h3>
            <h4 id='cabin-yourself'>You'll have the cabin to yourself.</h4>
            <h3 id='self-check'><i class="fas fa-key"></i> Self check-in</h3>
            <h4 id='check-yourself'>Check yourself in with the keypad.</h4>
            <h3 id='great-location'><i class="fas fa-map-marker-alt"></i> Great location</h3>
            <h4 id='location-rating'>95% of recent guests gave the location a 5-star rating.</h4>
            <div className="line-one-spot"></div>
            <div className="description-one-spot">
                <p>{oneSpot?.description}</p>
            </div>
            <div className="line-one-spot"></div>
            <div className="amenities-offered">
                <h2 id='place-offers'>What this place offers</h2>
            </div>
            <div className="all-amenities-one">
                <div className="left-amenities">
                    <p>{(oneSpot?.Amenities[0]?.fireplace) ? <p><i class="fas fa-fire"></i> Fire Place</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.hotTub) ? <p><i class="fas fa-hot-tub"></i> Hot Tub</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.kitchen) ? <p><i class="fas fa-utensils"></i> Kitchen</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.parking) ? <p><i class="fas fa-car"></i> Parking</p> : ''}</p>
                </div>
                <div className="right-amenities">
                    <p>{(oneSpot?.Amenities[0]?.pets) ? <p><i class="fas fa-dog"></i> Pets</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.BBQgrill) ? <p><i class="fas fa-hamburger"></i> BBQ Grill</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.boardGames) ? <p><i class="fas fa-chess-knight"></i> Board Games</p> : ''}</p>
                    <p>{(oneSpot?.Amenities[0]?.wifi) ? <p><i class="fas fa-wifi"></i> Wifi</p> : ''}</p>
                </div>
            </div>
            <div className="line-one-spot"></div>
            <div className="heading-for-reviews-s">
                <h2><i id='star-rating-ss' class="fas fa-star"></i> {avgStars()} • {reviews?.length} {reviews?.length === 1 ? 'Review' : 'Reviews'}</h2>
            </div>
                <Reviews spotId={spotId} sessionUser={sessionUser}/>
            <div className="line-one-spot"></div>
            <div>
                <SpotMap oneSpot={oneSpot}/>
            </div>
        </div>
    )
}

export default OneSpot
