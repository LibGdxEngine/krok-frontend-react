// pages/Profile.js
import React from 'react';
import Image from "next/image";
import profileImage from "../../../../public/profile.svg";

const Profile = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg mt-10 p-8">
                <div className="flex items-center space-x-4">
                    <Image
                        className="w-24 h-24 rounded-full "
                        src={profileImage}
                        width={150}
                        height={150}
                        alt="Profile Picture"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">Yomna Ashraf</h1>
                        <p className="text-gray-600">Dr. of Physiology</p>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Yomna"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Ashraf"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        defaultValue="Yomna.aea@gmail.com"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <div className="mt-2 flex items-center">
                        <input
                            type="radio"
                            name="gender"
                            value="female"
                            className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                            defaultChecked
                        />
                        <label className="ml-3 block text-sm font-medium text-gray-700">Female</label>
                        <input
                            type="radio"
                            name="gender"
                            value="male"
                            className="ml-6 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                        />
                        <label className="ml-3 block text-sm font-medium text-gray-700">Male</label>
                    </div>
                </div>
                <div className="mt-6">
                    <button
                        type="submit"
                        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
