import React, { useContext, useState } from 'react'
import useCarts from '../../hooks/useCarts'
import { FaTrash } from 'react-icons/fa'
import Swal from 'sweetalert2'
import { AuthContext } from '../../contexts/AuthProvider'

const CartPage = () => {
    const [cart, refetch] = useCarts();

    const { user } = useContext(AuthContext);

    const [cartsItems, setcartItems] = useState([]);

    // calculate price
    const calculatePrice = (item) => {
        return item.price * item.quantity

    }



    const handleDecrease = (item) => {
        if(item.quantity>1){
            fetch(`http://localhost:5001/carts/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ quantity: item.quantity - 1 })

        })
            .then(res => res.json())
            .then(data => {
                const updatedCart = cartsItems.map((cartsItem) => {
                    if (cartsItem.id === item.id) {
                        return {
                            ...cartsItem,
                            quantity: cartsItem.quantity - 1
                        }
                    }
                    return cartsItem;
                })
                refetch()
                setcartItems(updatedCart)
            })
        refetch()
        }else{
            alert("Item can't be zero")
        }

    }

    const handleIncrease = (item) => {
        fetch(`http://localhost:5001/carts/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ quantity: item.quantity + 1 })

        })
            .then(res => res.json())
            .then(data => {
                const updatedCart = cartsItems.map((cartsItem) => {
                    if (cartsItem.id === item.id) {
                        return {
                            ...cartsItem,
                            quantity: cartsItem.quantity + 1
                        }
                    }
                    return cartsItem;
                })
                refetch()
                setcartItems(updatedCart)
            })
        refetch()



    }

    // calculate total price 
    const cartSubTotal= cart.reduce((total,item)=>{
        return total + calculatePrice(item);
    },0);

    const oderTotal=cartSubTotal;



    const handleDelete = (item) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:5001/carts/${item._id}`, {
                    method: "DELETE"
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.deletedCount > 0) {
                            refetch()
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    })
            }
        });
    }
    return (
        <div className='section-container '>
            {/* banner section */}

            <div className="max-w-screen-2xl container mx-auto xl:px-24 bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%">
                <div className="py-36 flex flex-col  items-center justify-center gap-8">
                    {/* text side */}
                    <div className=' space-y-7 px-4'>
                        <h2 className='md:text-5xl text-4xl font-bold md:leading-sung leading-sung'>Items Added to The <span className='text-green'>Cart</span></h2>
                    </div>

                </div>

            </div>
            {/* table section */}
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead className='bg-green text-white rounded-sm'>
                            <tr>
                                <th>#</th>
                                <th>Food</th>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            {
                                cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar">
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img src={item.image} alt="" />
                                                    </div>
                                                </div>

                                            </div>
                                        </td>
                                        <td className='font-medium'>
                                            {item.name}
                                        </td>
                                        <td>
                                            <button className='btn btn-xs' onClick={() => handleDecrease(item)}>-</button>
                                            <input type="number" value={item.quantity} className='w-10 mx-2 text-center overflow-hidden appearance-none' onChange={() => console.log(item.quantity)} />
                                            <button className='btn btn-xs' onClick={() => handleIncrease(item)}>+</button>
                                        </td>
                                        <td>${calculatePrice(item).toFixed(2)}</td>
                                        <th>
                                            <button className="btn btn-ghost text-red btn-xs" onClick={() => handleDelete(item)}>
                                                <FaTrash />
                                            </button>
                                        </th>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
            {/* customer detail */}
            <div className='my-12 flex flex-cols md:flex-row justify-between items-start'>
                <div className='md:w-1/2 space-y-3'>
                    <h3 className='font-medium'>Customer Detail</h3>
                    <p>Name:{user.displayName}</p>
                    <p>Email:{user.email}</p>
                    <p>Name:{user.uid}</p>
                </div>
                <div className='md:w-1/2 space-y-3 '>
                    <h3 className='font-medium'>Shopping Details</h3>
                    <p>Total Item :{cart.length}</p>
                    <p>Total Price : ${oderTotal.toFixed(2)}</p>
                    <button className='btn bg-green text-white'>Procceed Checkout</button>
                </div>
            </div>
        </div>
    )
}

export default CartPage