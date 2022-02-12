/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationIcon } from "@heroicons/react/outline"

export default function EmailModal({
	open,
	setOpen,
	cancelButtonRef,
	yourSeats,
	yourData,
	yourDataChangeHandler,
	yourTotal,
	bookingFee,
	enable2ndSubmit,
	submitSeats,
}) {
	const seatTypeSwitch = (seat) => {
		switch (seat.seat.type) {
			case "STANDARD":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/standardSeat.svg'
					/>
				)
			case "VIP":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/VIPSeat.svg'
					/>
				)
			case "WHEELCHAIRSPACE":
				return (
					<img
						className=' absolute '
						style={{ width: "3rem" }}
						src='/seats/WheelchairSpace.svg'
					/>
				)
			case "RECLINER":
				return (
					<img
						className=' absolute'
						style={{ width: "3rem" }}
						src='/seats/TheRecliner.svg'
					/>
				)
		}
	}
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog
				as='div'
				className='fixed z-10 inset-0 overflow-y-auto'
				initialFocus={cancelButtonRef}
				onClose={setOpen}
			>
				<div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
					>
						<Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span
						className='hidden sm:inline-block sm:align-middle sm:h-screen'
						aria-hidden='true'
					>
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
							<>
								{/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
								<div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
									<div className='sm:mx-auto sm:w-full sm:max-w-md'>
										<h2 className='mt-6 text-center text-3xl font-light font-roboto text-gray-900'>
											Please provide your details
										</h2>
									</div>

									<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
										<div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
											<form className='space-y-6' action='#' method='POST'>
												<div>
													<label
														htmlFor='fullName'
														className='block text-sm font-medium text-gray-700'
													>
														Full Name
													</label>
													<div className='mt-1'>
														<input
															id='fullName'
															name='fullName'
															type='text'
															autoComplete='fullName'
															required
															className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
															value={yourData.fullName}
															onChange={(e) => {
																yourDataChangeHandler(e)
															}}
														/>
													</div>
												</div>
												<div>
													<label
														htmlFor='email'
														className='block text-sm font-medium text-gray-700'
													>
														Email address
													</label>
													<div className='mt-1'>
														<input
															id='email'
															name='email'
															type='email'
															autoComplete='email'
															required
															value={yourData.email}
															onChange={(e) => {
																yourDataChangeHandler(e)
															}}
															className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
														/>
													</div>
												</div>
												<div>
													<label className='block text-sm font-medium text-gray-700'>
														Your Seats
													</label>
													<div className='grid gap-3 grid-cols-4 md:grid-cols-5 lg:grid-cols-5 grid-flow-row z-0 relative mb-10 min-w-full p-2 border border-gray-300 rounded-md shadow-sm'>
														{yourSeats.map((seat, index) => (
															<div
																className='h-10 relative cursor-pointer'
																onClick={(e) => {
																	removeYourSeat(e, seat)
																}}
															>
																{seatTypeSwitch(seat)}
																<p className=' text-gray-700 z-10 relative left-3'>
																	{seat.col + 1}
																	{seat.seatLetter}
																</p>
															</div>
														))}
													</div>
												</div>
												<div className='grid grid-cols-2 grid-flow-row w-full'>
													<p className=' text-xs'>
														Total (incl. £{bookingFee}/€{bookingFee} booking fee
														per ticket)
													</p>
													<p className='text-2xl font-bold text-right'>
														£{yourTotal}
													</p>
												</div>
											</form>
										</div>
									</div>
								</div>
							</>
							<div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									className={`w-full inline-flex justify-center rounded-md  shadow-sm px-4 py-2 ${
										enable2ndSubmit
											? `bg-gradient-to-r from-red-500 to-orange-400`
											: `bg-gray-300`
									} text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm `}
									onClick={() => {
										setOpen(false)
										submitSeats()
									}}
									disabled={!enable2ndSubmit}
								>
									Confirm Booking
								</button>
								<button
									type='button'
									className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm`}
									onClick={() => {
										setOpen(false)
									}}
									ref={cancelButtonRef}
								>
									Cancel
								</button>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	)
}
