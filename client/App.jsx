import React, { useState } from "react";

export default function App() {
  const [transcript, setTranscript] = useState("");
  const [restaurant, setRestaurant] = useState(null);

  const handleTranscribe = async () => {
    const res = await fetch("/api/transcribe", { method: "POST" });
    const data = await res.json();
    setTranscript(data.text);

    if (data.text.includes("吃")) {
      const loc = await getLocation();
      const r = await fetch(`/api/restaurant?lat=${loc.lat}&lng=${loc.lng}`);
      const restaurantData = await r.json();
      setRestaurant(restaurantData);
      speakRecommendation(restaurantData);
    }
  };

  const speakRecommendation = (r) => {
    const msg = new SpeechSynthesisUtterance(
      `附近评分最高的是 ${r.name}，评分 ${r.rating}，要我帮你打电话吗？`
    );
    speechSynthesis.speak(msg);
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🎙️ 说：“我想吃中餐”</h1>
      <button onClick={handleTranscribe}>🎧 录音识别</button>
      <p>你说的话：{transcript}</p>
      {restaurant && (
        <div>
          <h3>🍜 推荐餐馆：{restaurant.name}</h3>
          <p>📞 电话：<a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></p>
          <p>📍 地址：{restaurant.address}</p>
        </div>
      )}
    </div>
  );
}
