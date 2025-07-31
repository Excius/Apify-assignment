import React, { useContext, useState } from "react";
import axios from "../utils/axios";
import { ApiContext } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { setApiKey } = useContext(ApiContext);
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState();
  const [isValidating, setIsValidating] = useState(false);
  const nav = useNavigate();

  const validate = async () => {
    if (!keyInput.trim()) {
      setError("Please enter your API key");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      await axios.get("/api/auth/validate-key", {
        headers: { Authorization: `Bearer ${keyInput}` },
      });
      setApiKey(keyInput);
      nav("/actors");
    } catch (err) {
      console.error("API key validation failed:", err);
      setError(err.response?.data?.error || "Invalid API key");
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      validate();
    }
  };

  return (
    <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-white"
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ActorHub
          </h2>
          <p className="text-gray-600">
            Enter your Apify API key to get started with running actors
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label
              htmlFor="apiKey"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Apify API Key
            </label>
            <div className="relative">
              <input
                id="apiKey"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your API key..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                disabled={isValidating}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-2"
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
                <span className="text-red-700 text-sm font-medium">
                  {error}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={validate}
            disabled={isValidating || !keyInput.trim()}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${
              isValidating || !keyInput.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
          >
            {isValidating ? (
              <>
                <svg
                  className="animate-spin w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Validating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Connect & Continue
              </>
            )}
          </button>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>Don't have an API key?</p>
            <a
              href="https://console.apify.com/account#/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              Get your API key from Apify Console
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
