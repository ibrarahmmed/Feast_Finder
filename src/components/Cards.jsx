import React, { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import Swal from 'sweetalert2'

const Cards = ({ item }) => {
    const { name, image, price, recipe, _id } = item;

    const [isHeartFilled, setIsHeartFilled] = useState(false);
    const { user } = useContext(AuthContext);

    const navigate=useNavigate();
    const location=useLocation();

    const handleAddtoCart = (item) => {
        if (user && user?.email) {
            const cartItem = {
                menuItemId: _id,
                name,
                recipe, // Add the recipe to the cart item
                quantity: 1,
                image,
                price,
                email: user.email
            };

            fetch('http://localhost:5001/carts', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartItem)
            })
            .then(res => res.json())
            .then(data => {
                console.log("Response from server:", data);

                if(data.insertedId){
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Your food has been added",
                        showConfirmButton: false,
                        timer: 1500
                      });
                }



            })
            .catch(error => {
                console.error("Error adding to cart:", error);
            });
        }else{
            Swal.fire({
                title: "Please Login",
                text: "Without an account can't able to add products",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Signup Now"
              }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/signup',{state:{from:location}})
                 
                }
              });
        }
    };

    const handleHeartClick = () => {
        setIsHeartFilled(!isHeartFilled);
    };

    return (
        <div className="card shadow-xl relative mr-5 md:my-5">
            <div
                className={`rating gap-1 absolute right-2 top-2 p-4 heartStar bg-green ${isHeartFilled ? "text-rose-500" : "text-white"}`}
                onClick={handleHeartClick}
            >
                <FaHeart className="w-5 h-5 cursor-pointer" />
            </div>
            <Link to={`/menu/${item._id}`}>
                <figure>
                    <img src={item.image} alt="Item" className="hover:scale-105 transition-all duration-300 md:h-72" />
                </figure>
            </Link>
            <div className="card-body">
                <Link to={`/menu/${item._id}`}>
                    <h2 className="card-title">{item.name}</h2>
                </Link>
                <p>{recipe}</p>
                <div className="card-actions justify-between items-center mt-2">
                    <h5 className="font-semibold">
                        <span className="text-sm text-red">$ </span> {item.price}
                    </h5>
                    <button className="btn bg-green text-white" onClick={() => handleAddtoCart(item)}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default Cards;

