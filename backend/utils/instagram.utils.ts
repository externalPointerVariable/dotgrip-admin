import express from "express";

const getInstagramDetails = async (username: any) => {
  // Mocked data for demonstration
  return {
    username,
    followers: Math.floor(Math.random() * 10000),
    posts: Math.floor(Math.random() * 500),
    profilePicture: `https://instagram.com/${username}/profile.jpg`,
  };
}

export { getInstagramDetails };