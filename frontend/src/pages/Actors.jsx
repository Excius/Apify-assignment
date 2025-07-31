import React, { useContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";

export default function Actors() {
  const { apiKey } = useContext(ApiContext);
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Redirect to home if no API key is set
    if (!apiKey) {
      nav("/");
      return;
    }

    setLoading(true);
    axios
      .get("/api/actors", {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      .then((resp) => {
        setActors(resp.data.actors);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load actors");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiKey, nav]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Actors
          </h1>
          <p className="text-gray-600">Choose an actor to run</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Available Actors
          </h1>
          <p className="text-gray-600">Choose an actor to run</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-red-800 font-semibold">
                Error Loading Actors
              </h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Available Actors
        </h1>
        <p className="text-gray-600">
          Choose an actor to run ({actors.length} available)
        </p>
      </div>

      {actors.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
          <svg
            className="w-12 h-12 text-yellow-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-yellow-800 font-semibold text-lg mb-2">
            No Actors Found
          </h3>
          <p className="text-yellow-600">
            No actors are available in your account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {actors.map((act) => (
            <div
              key={act.id}
              onClick={() => nav(`/actors/${act.id}`)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 cursor-pointer transition-all duration-200 transform hover:scale-105 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ready
                  </span>
                </div>
              </div>

              <h2 className="font-bold text-lg text-gray-900 mb-2 truncate">
                {act.name}
              </h2>
              <p className="text-sm text-gray-500 font-mono mb-3 truncate">
                {act.id}
              </p>

              {act.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {act.description}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Click to run
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
